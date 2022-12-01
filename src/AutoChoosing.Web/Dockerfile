#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

# Compile JS Files
FROM node:14 AS webpack
WORKDIR /src
COPY . .
# Test Console
RUN ls
RUN npm install && npm run dev

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["../NuGet.Config", "."]
COPY [".", "./AutoChoosing.Web/"]
COPY ["../AutoChoosing.Core/", "./AutoChoosing.Core/"]
# Test Console
RUN ls
RUN dotnet restore "./AutoChoosing.Web/AutoChoosing.Web.csproj"

WORKDIR "/src/AutoChoosing.Web"
COPY --from=webpack "/src/wwwroot" "./AutoChoosing.Web/wwwroot"
RUN dotnet build "AutoChoosing.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AutoChoosing.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AutoChoosing.Web.dll"]