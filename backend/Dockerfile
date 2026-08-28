# ===== Stage 1: Maven Build =====
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

# Önce bağımlılıkları indirmek için sadece pom.xml kopyala (Docker cache optimizasyonu)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kaynak kodu kopyala ve derle
COPY src ./src
RUN mvn package -DskipTests -B

# ===== Stage 2: Minimal Runtime =====
FROM eclipse-temurin:25-jre

WORKDIR /app

# Uygulama JAR dosyasını kopyala
COPY --from=build /app/target/*.jar app.jar

# Yükleme dizinini oluştur
RUN mkdir -p /app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
