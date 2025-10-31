import puppeteer from "puppeteer-core";
import { ObjectAttributes } from "../../objects/object.model";

export async function getObjectsByUserId(userId: string) {
  // Connect to already-running Brave
  const browser = await puppeteer.connect({
    browserURL: "http://127.0.0.1:9222", // Connect instead of launching
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Navigate to your target URL
  await page.goto(
    `https://server.autotracker.com.ng/func/cpanel.users.php?cmd=user_object_list_get&id=${userId}&_search=false&nd=1761517130526&rows=50&page=1&sidx=name&sord=asc`,
    {
      waitUntil: "networkidle0", // Wait for all XHR requests
    }
  );

  // Extract page response content
  const content = await page.evaluate(() => document.body.innerText);

  try {
    const parsed = JSON.parse(content);
    const records = parsed.rows;
    if (!records) return [];

    const transformedObjects: ObjectAttributes[] = [];
    for (const record of records) {
      const transformed = await transformObjectRecord(record, userId);
      console.log("Processed Object:", transformed.objectId);
      transformedObjects.push(transformed);
    }

    //await browser.close();
    return transformedObjects ?? [];

    //Name, IMEI, Active(objectDeactivate ?? true), Expiry Date, Last Connection, Status(connection-gsm-gps ?  true)
  } catch (err) {
    console.log("Raw content:", content);
    console.log("JSON parse error:", err.message);
  }
}

function extractNumber(input: string): number | null {
  const match = input.match(/\d+/);
  return match ? Number(match[0]) : null;
}

async function transformObjectRecord(record: any, userId: string) {
  const cell = record.cell;

  const objectId = cell[1];
  const name = cell[0];
  const IMEI = cell[1];
  const active = cell[2]?.includes("objectDeactivate");
  const expiryDate = cell[3];
  const lastConnection = cell[4];
  const status = cell[5]?.includes("connection-gsm-gps");

  return {
    objectId,
    userId,
    name,
    IMEI,
    active,
    expiryDate,
    lastConnection,
    status,
  };
}

export async function transformUserRecord(record: any) {
  const cell = record.cell;

  const userId = cell[0];
  const userName = cell[1];
  const emailRaw = cell[2];

  // Clean email if it has ".com.com" mistake
  const userEmail = emailRaw?.replace(".com.com", ".com");

  const Active = cell[3]?.includes("userDeactivate");
  const ExpiryDate = cell[4];
  const Privileges = cell[5];
  const apiAccess = cell[6]?.includes("userApiDeactivate");
  const registrationDate = cell[7];
  const lastLogin = cell[8];
  const ipAddress = cell[9];
  const subAccounts = Number(cell[10]);
  const objectCount = extractNumber(cell[11]);
  const Email = Number(cell[12]);
  const Sms = Number(cell[13]);
  const Webhook = Number(cell[14]);
  const API = Number(cell[15]);

  return {
    userId,
    userName,
    userEmail,
    Active,
    ExpiryDate,
    Privileges,
    apiAccess,
    registrationDate,
    lastLogin,
    ipAddress,
    subAccounts,
    objectCount,
    Email,
    Sms,
    Webhook,
    API,
  };
}
