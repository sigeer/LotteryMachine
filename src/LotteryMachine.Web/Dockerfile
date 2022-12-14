#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

# Compile JS Files
FROM node:14 AS webpack
WORKDIR /src
COPY ./LotteryMachine.Web .
RUN npm install && npm run pro

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "./LotteryMachine.Web/LotteryMachine.Web.csproj"

WORKDIR "/src/LotteryMachine.Web"
RUN dotnet build "LotteryMachine.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LotteryMachine.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false
COPY --from=webpack "/src/wwwroot" "/app/publish/wwwroot"
# Test Console
RUN ls /app/publish/wwwroot

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LotteryMachine.Web.dll"]