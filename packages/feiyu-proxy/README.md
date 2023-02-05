# 快速构建 multi-scf-nodejs

**中文** | [English](./README_EN.md)

## 简介

multi-scf-nodejs 模板使用 Tencent SCF 组件及其触发器能力，方便的在腾讯云创建，配置和管理一个 multi-scf-nodejs 应用。

## 快速开始

### 1. 安装

```bash
# 安装 Serverless Cloud Framework
npm install -g serverless-cloud-framework
```

### 2. 创建

通过如下命令直接下载该例子：

```bash
scf init multi-scf-nodejs --name example
cd example
```

### 3. 部署

在 `serverless.yml` 文件所在的项目根目录，运行以下指令，将会弹出二维码，直接扫码授权进行部署：

```bash
scf deploy
```

> **说明**：如果鉴权失败，请参考 [权限配置](https://cloud.tencent.com/document/product/1154/43006) 进行授权。

### 4. 查看状态

执行以下命令，查看您部署的项目信息：

```bash
scf info
```

### 5. 移除

可以通过以下命令移除 multi-scf-nodejs 应用

```bash
scf remove
```

### 账号配置（可选）

serverless 默认支持扫描二维码登录，用户扫描二维码后会自动生成一个 `.env` 文件并将密钥存入其中.
如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件, 
把从[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取的 `SecretId` 和`SecretKey` 填入其中.

> 如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

```bash
# 腾讯云的配置信息
touch .env
```

```
# .env file
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```
