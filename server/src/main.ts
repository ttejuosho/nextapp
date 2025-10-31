import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000", // your React app URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3001}`
  );
}
bootstrap();
