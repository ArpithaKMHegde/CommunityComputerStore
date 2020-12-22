USE [master]
GO
/****** Object:  Database [ecomcommunitystore]    ******/
CREATE DATABASE [ecomcommunitystore]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ecomcommunitystore', FILENAME = N'D:\Arpitha\MS\DB_Project\Database_Files\ecomcommunitystore.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ecomcommunitystore_log', FILENAME = N'D:\Arpitha\MS\DB_Project\Database_Files\ecomcommunitystore_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [ecomcommunitystore] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ecomcommunitystore].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ecomcommunitystore] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET ARITHABORT OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ecomcommunitystore] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ecomcommunitystore] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ecomcommunitystore] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ecomcommunitystore] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET RECOVERY FULL 
GO
ALTER DATABASE [ecomcommunitystore] SET  MULTI_USER 
GO
ALTER DATABASE [ecomcommunitystore] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ecomcommunitystore] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ecomcommunitystore] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ecomcommunitystore] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ecomcommunitystore] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'ecomcommunitystore', N'ON'
GO
ALTER DATABASE [ecomcommunitystore] SET QUERY_STORE = OFF
GO
USE [ecomcommunitystore]
GO
/****** Object:  UserDefinedTableType [dbo].[MemberType] ******/
CREATE TYPE [dbo].[MemberType] AS TABLE(
	[MemberId] [int] NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Address] [nvarchar](250) NULL,
	[EmailId] [nvarchar](320) NULL,
	[ContactNumber] [nvarchar](16) NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT ((0))
)
GO
/****** Object:  UserDefinedTableType [dbo].[ProductType]   ******/
CREATE TYPE [dbo].[ProductType] AS TABLE(
	[ProductId] [int] NULL,
	[ProductNumber] [nvarchar](10) NOT NULL,
	[ProductName] [nvarchar](50) NOT NULL,
	[ProductDescription] [nvarchar](100) NOT NULL,
	[Brand] [nvarchar](30) NOT NULL,
	[MemberId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[PricePerUnit] [decimal](10, 2) NOT NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT ((0))
)
GO
/****** Object:  UserDefinedTableType [dbo].[SalesDetailsType] ******/
CREATE TYPE [dbo].[SalesDetailsType] AS TABLE(
	[SalesDetailsId] [int] NOT NULL,
	[SalesId] [int] NULL,
	[ProductId] [int] NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](10, 2) NOT NULL,
	[TotalPrice] [decimal](10, 2) NOT NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT ((0))
)
GO
/****** Object:  UserDefinedTableType [dbo].[SalesType]  ******/
CREATE TYPE [dbo].[SalesType] AS TABLE(
	[SalesId] [int] NOT NULL,
	[MemberId] [int] NOT NULL,
	[SalesDateTime] [datetime] NOT NULL,
	[ReceiptNumber] [nvarchar](15) NOT NULL,
	[DiscountAmount] [decimal](10, 2) NOT NULL,
	[TotalBillAmount] [decimal](10, 2) NOT NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT ((0))
)
GO
/****** Object:  UserDefinedTableType [dbo].[TransactionType] ******/
CREATE TYPE [dbo].[TransactionType] AS TABLE(
	[TransactionId] [int] NULL,
	[SalesId] [int] NOT NULL,
	[TotalAmount] [decimal](10, 2) NOT NULL,
	[PaymentType] [nvarchar](20) NOT NULL,
	[TransactionStatus] [int] NOT NULL,
	[TransactionDate] [datetime] NOT NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT ((0))
)
GO
/****** Object:  UserDefinedTableType [dbo].[UserType] ******/
CREATE TYPE [dbo].[UserType] AS TABLE(
	[UserId] [int] NOT NULL,
	[UserName] [nvarchar](10) NOT NULL,
	[EncryptedAccessKey] [nvarchar](64) NOT NULL,
	[IsDeleted] [bit] NOT NULL DEFAULT ((0))
)
GO
/****** Object:  Table [dbo].[Member]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Member](
	[MemberId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Address] [nvarchar](250) NULL,
	[EmailId] [nvarchar](320) NULL,
	[ContactNumber] [nvarchar](16) NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NULL,
 CONSTRAINT [PK_Member] PRIMARY KEY CLUSTERED 
(
	[MemberId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[ProductId] [int] IDENTITY(1,1) NOT NULL,
	[ProductNumber] [nvarchar](10) NOT NULL,
	[ProductName] [nvarchar](50) NOT NULL,
	[ProductDescription] [nvarchar](100) NOT NULL,
	[Brand] [nvarchar](30) NOT NULL,
	[MemberId] [int] NULL,
	[Quantity] [int] NOT NULL,
	[PricePerUnit] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_Product] UNIQUE NONCLUSTERED 
(
	[ProductNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SalesDetails]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SalesDetails](
	[SalesDetailsId] [int] IDENTITY(1,1) NOT NULL,
	[SalesId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](10, 2) NOT NULL,
	[TotalPrice] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_SalesDetails] PRIMARY KEY CLUSTERED 
(
	[SalesDetailsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sales]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sales](
	[SalesId] [int] IDENTITY(1,1) NOT NULL,
	[MemberId] [int] NULL,
	[SalesDateTime] [datetime] NOT NULL,
	[ReceiptNumber] [nvarchar](15) NOT NULL,
	[DiscountAmount] [decimal](10, 2) NOT NULL,
	[TotalBillAmount] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_Sales] PRIMARY KEY CLUSTERED 
(
	[SalesId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Transaction]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transaction](
	[TransactionId] [int] IDENTITY(1,1) NOT NULL,
	[SalesId] [int] NOT NULL,
	[TotalAmount] [decimal](10, 2) NOT NULL,
	[PaymentType] [nvarchar](20) NOT NULL,
	[TransactionStatus] [int] NOT NULL,
	[TransactionDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Transaction] PRIMARY KEY CLUSTERED 
(
	[TransactionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[GetRawTransactionDetails] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[GetRawTransactionDetails]
AS
SELECT			tr.TransactionId, 
				tr.TotalAmount, 
				s.SalesId, 
				tr.PaymentType, 
				tr.TransactionStatus, 
				tr.TransactionDate, 
				s.MemberId, 
				m.FirstName, 
				s.SalesDateTime, 
				s.DiscountAmount, 
				s.ReceiptNumber, 
				s.TotalBillAmount, 
				sd.ProductId, 
				P.ProductNumber, 
				P.ProductName, 
				P.ProductDescription,
				p.Brand,
				sd.SalesDetailsId, 
				sd.UnitPrice, 
				sd.Quantity, 
				sd.TotalPrice
FROM            dbo.Member m INNER JOIN
                         dbo.Sales s ON M.MemberId = S.MemberId INNER JOIN
                         dbo.SalesDetails sd ON S.SalesId = SD.SalesId INNER JOIN
                         dbo.Product P ON sd.ProductId = p.ProductId INNER JOIN
                         dbo.[Transaction]  tr ON s.SalesId = tr.SalesId
GO
/****** Object:  Table [dbo].[User] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](10) NOT NULL,
	[EncryptedAccessKey] [nvarchar](64) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_UNIQUEUSERNAME] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Member] ADD  CONSTRAINT [DF_EndDate]  DEFAULT (NULL) FOR [EndDate]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_Member] FOREIGN KEY([MemberId])
REFERENCES [dbo].[Member] ([MemberId])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_Member]
GO
ALTER TABLE [dbo].[Sales]  WITH CHECK ADD  CONSTRAINT [FK_Sales_Member] FOREIGN KEY([MemberId])
REFERENCES [dbo].[Member] ([MemberId])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[Sales] CHECK CONSTRAINT [FK_Sales_Member]
GO
ALTER TABLE [dbo].[SalesDetails]  WITH CHECK ADD  CONSTRAINT [FK_SalesDetails_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([ProductId])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[SalesDetails] CHECK CONSTRAINT [FK_SalesDetails_Product]
GO
ALTER TABLE [dbo].[SalesDetails]  WITH CHECK ADD  CONSTRAINT [FK_SalesDetails_Sales_1] FOREIGN KEY([SalesId])
REFERENCES [dbo].[Sales] ([SalesId])
GO
ALTER TABLE [dbo].[SalesDetails] CHECK CONSTRAINT [FK_SalesDetails_Sales_1]
GO
ALTER TABLE [dbo].[Transaction]  WITH CHECK ADD  CONSTRAINT [FK_Transaction_Sales] FOREIGN KEY([SalesId])
REFERENCES [dbo].[Sales] ([SalesId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Transaction] CHECK CONSTRAINT [FK_Transaction_Sales]
GO
/****** Object:  StoredProcedure [dbo].[GetMember] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetMember] (@MemberId int = 0)
AS
BEGIN
                IF(@MemberId = 0)
                BEGIN
                      SELECT * FROM [dbo].[Member]
                END
                ELSE
                BEGIN
                      SELECT * FROM [dbo].[Member] WHERE MemberId = @MemberId
                END
END
GO
/****** Object:  StoredProcedure [dbo].[GetProduct]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec [GetProduct] 
CREATE PROCEDURE [dbo].[GetProduct] (@productId int = 0)
AS
BEGIN
                IF(@productId = 0)
                BEGIN

					  Select isnull(sd.ProductId,  p.ProductId ) ProductId,
					  p.ProductNumber, 
					  p.ProductName,
					  p.ProductDescription,
					  p.Brand,
					  p.MemberId,
					  p.PricePerUnit,
					  p.Quantity as InitialQuantity, 
					  ( p.Quantity -  Isnull(sd.Quantity, 0)) as RemainingQuantity 
					  from product p left join (Select ProductId, sum(Quantity) Quantity from SalesDetails group by ProductId) sd on p.ProductId = sd.ProductId
                END
                ELSE
                BEGIN
					  Select isnull(sd.ProductId,  p.ProductId ) ProductId,
					  p.ProductNumber, 
					  p.ProductName,
					  p.ProductDescription,
					  p.Brand,
					  p.MemberId,
					  p.PricePerUnit,
					  p.Quantity as InitialQuantity, 
					  ( p.Quantity -  Isnull(sd.Quantity, 0)) as RemainingQuantity 
					  from product p left join (Select ProductId, sum(Quantity) Quantity from SalesDetails group by ProductId) sd on p.ProductId = sd.ProductId
				      WHERE p.ProductId = @productId
                END
END
GO
/****** Object:  StoredProcedure [dbo].[GetSales] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetSales] (@SalesId int = 0)
AS
BEGIN
                IF(@SalesId = 0)
                BEGIN
                      SELECT * FROM dbo.Sales 
                END
                ELSE
                BEGIN
                      SELECT * FROM dbo.Sales  WHERE SalesId = @SalesId
                END
END
GO
/****** Object:  StoredProcedure [dbo].[GetSalesDetails]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetSalesDetails] (@SalesDetailsId int = 0)
AS
BEGIN
                IF(@SalesDetailsId = 0)
                BEGIN
                      SELECT * FROM dbo.SalesDetails 
                END
                ELSE
                BEGIN
                      SELECT * FROM dbo.SalesDetails  WHERE SalesDetailsId = @SalesDetailsId
                END
END
GO
/****** Object:  StoredProcedure [dbo].[GetTransaction]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetTransaction] (@TransactionId int = 0)
AS
BEGIN
                IF(@TransactionId = 0)
                BEGIN
                      Select * from [GetRawTransactionDetails]
                END
                ELSE
                BEGIN
                      Select * from [GetRawTransactionDetails] WHERE TransactionId = @TransactionId
                END
END
GO
/****** Object:  StoredProcedure [dbo].[GetUser]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec [GetUser] 
CREATE PROCEDURE [dbo].[GetUser] (@userId int = 0)
AS
BEGIN
                IF(@userId = 0)
                BEGIN
                      Select * from [dbo].[User]
                END
                ELSE
                BEGIN
                      Select * from [dbo].[User] WHERE UserId = @userId
                END
END
GO
/****** Object:  StoredProcedure [dbo].[SaveMember]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SaveMember] (@MemberItems MemberType readonly)
AS
BEGIN
                DECLARE @TempMemberItems MemberType
                DELETE a FROM [dbo].[Member] a INNER JOIN @MemberItems B ON A.MemberId = B.MemberId AND B.IsDeleted = 1
                
				UPDATE [dbo].[Member] SET
				FirstName = B.FirstName,
				LastName = B.LastName,
				Address = B.Address,
				EmailId = B.EmailId,
				ContactNumber = B.ContactNumber,
				StartDate = B.StartDate,
				EndDate = B.EndDate
                FROM [dbo].[Member] A INNER JOIN @MemberItems B ON A.MemberId = B.MemberId AND B.IsDeleted = 0

                INSERT INTO [dbo].[Member] ([FirstName], [LastName], [Address], [EmailId], [ContactNumber], [StartDate], [EndDate])

                OUTPUT inserted.[MemberId], inserted.[FirstName], inserted.[LastName], inserted.[Address], inserted.[EmailId], inserted.[ContactNumber], inserted.[StartDate], inserted.[EndDate]

                INTO @TempMemberItems ([MemberId], [FirstName], [LastName], [Address], [EmailId], [ContactNumber], [StartDate], [EndDate])

				SELECT [FirstName], [LastName], [Address], [EmailId], [ContactNumber], [StartDate], [EndDate]
				FROM @MemberItems a
                WHERE  a.MemberId = 0 AND a.IsDeleted = 0

                Select [MemberId], [FirstName], [LastName], [Address], [EmailId], [ContactNumber], [StartDate], [EndDate]
                FROM [dbo].[Member] A WHERE A.MemberId in 
				(SELECT Isnull(b.MemberId, a.MemberId)  FROM  @MemberItems a full outer join @TempMemberItems b ON a.MemberId = b.MemberId)
END
GO
/****** Object:  StoredProcedure [dbo].[SaveProduct]   ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SaveProduct] (@ProductItems ProductType readonly)
AS
BEGIN
                DECLARE @TempProductItems ProductType
                DELETE a FROM [dbo].[Product] a INNER JOIN @ProductItems B ON A.ProductId = B.ProductId AND B.IsDeleted = 1
                
				UPDATE [dbo].[Product] SET
				ProductNumber = B.ProductNumber,
				ProductName = B.ProductName,
				ProductDescription = B.ProductDescription,
				Brand = B.Brand,
				MemberId = B.MemberId,
				Quantity = B.Quantity,
				PricePerUnit = B.PricePerUnit
                FROM [dbo].Product A INNER JOIN @ProductItems B ON A.ProductId = B.ProductId AND B.IsDeleted = 0

                INSERT INTO [dbo].[Product] ([ProductNumber], [ProductName], [ProductDescription], [Brand], [MemberId], [Quantity], [PricePerUnit])

                OUTPUT inserted.[ProductId], inserted.[ProductNumber], inserted.[ProductName], inserted.[ProductDescription], inserted.[Brand], inserted.[MemberId], inserted.[Quantity], inserted.[PricePerUnit]

                INTO @TempProductItems ([ProductId], [ProductNumber], [ProductName], [ProductDescription], [Brand], [MemberId], [Quantity], [PricePerUnit])

				SELECT [ProductNumber], [ProductName], [ProductDescription], [Brand], [MemberId], [Quantity], [PricePerUnit] FROM @ProductItems a
                WHERE  a.ProductId = 0 AND a.IsDeleted = 0

                Select [ProductId], [ProductNumber], [ProductName], [ProductDescription], [Brand], [MemberId], InitialQuantity,RemainingQuantity , [PricePerUnit]
                FROM (Select isnull(sd.ProductId,  p.ProductId ) ProductId,
					  p.ProductNumber, 
					  p.ProductName,
					  p.ProductDescription,
					  p.Brand,
					  p.MemberId,
					  p.PricePerUnit,
					  p.Quantity as InitialQuantity, 
					  ( p.Quantity -  Isnull(sd.Quantity, 0)) as RemainingQuantity 
					  from product p left join (Select ProductId, sum(Quantity) Quantity from SalesDetails group by ProductId) sd on p.ProductId = sd.ProductId) A WHERE A.ProductId in
				(SELECT Isnull(b.ProductId, a.ProductId)  FROM @ProductItems a full outer join @TempProductItems b ON a.ProductId = b.ProductId)
END

GO
/****** Object:  StoredProcedure [dbo].[SaveTransaction] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SaveTransaction] (@TransactionItems  TransactionType  readonly, 
                                            @SalesItems        SalesType        readonly,
                                            @SalesDetailsItems SalesDetailsType readonly)
AS
BEGIN
                DECLARE @TempTransactionItems  TransactionType
				DECLARE @TempSalesItems        SalesType

                DELETE a FROM [dbo].[Sales]        a INNER JOIN @SalesItems        B ON A.SalesId        = B.SalesId        AND B.IsDeleted = 1;
                DELETE a FROM [dbo].[SalesDetails] a INNER JOIN @SalesDetailsItems B ON A.SalesDetailsId = B.SalesDetailsId AND B.IsDeleted = 1;
				DELETE a FROM [dbo].[Transaction]  a INNER JOIN @TransactionItems  B ON A.TransactionId  = B.TransactionId  AND B.IsDeleted = 1;
                
				UPDATE [dbo].[Transaction] SET
				SalesId =           B.SalesId,
				TotalAmount =       B.TotalAmount,
				PaymentType =       B.PaymentType, 
				TransactionStatus = B.TransactionStatus,
				TransactionDate =   B.TransactionDate
                FROM [dbo].[Transaction]  A INNER JOIN @TransactionItems B ON A.TransactionId = B.TransactionId AND B.IsDeleted = 0

				UPDATE [dbo].[Sales] SET
				MemberId =          B.MemberId,
				SalesDateTime =     B.SalesDateTime,
				ReceiptNumber =     B.ReceiptNumber,
				DiscountAmount =    B.DiscountAmount,
				TotalBillAmount =   B.TotalBillAmount
                FROM [dbo].Sales  A INNER JOIN @SalesItems B ON A.SalesId = B.SalesId AND B.IsDeleted = 0

				UPDATE [dbo].[SalesDetails] SET
				SalesId =           B.SalesId,
				ProductId =         B.ProductId,
				Quantity =          B.Quantity,
				UnitPrice =         B.UnitPrice,
				TotalPrice =        B.TotalPrice
                FROM [dbo].SalesDetails  A INNER JOIN @SalesDetailsItems B ON A.SalesDetailsId = B.SalesDetailsId AND B.IsDeleted = 0



				INSERT INTO [dbo].[Sales] ([MemberId], [SalesDateTime], [ReceiptNumber], [DiscountAmount], [TotalBillAmount])
				OUTPUT inserted.[SalesId], inserted.[MemberId], inserted.[SalesDateTime], inserted.[ReceiptNumber], inserted.[DiscountAmount], inserted.[TotalBillAmount]

                INTO @TempSalesItems ([SalesId], [MemberId], [SalesDateTime], [ReceiptNumber], [DiscountAmount], [TotalBillAmount])

				SELECT [MemberId], [SalesDateTime], [ReceiptNumber], [DiscountAmount], [TotalBillAmount] FROM @SalesItems a
                WHERE  a.SalesId = 0 AND a.IsDeleted = 0



                INSERT INTO [dbo].[Transaction] ([SalesId], [TotalAmount], [PaymentType], [TransactionStatus], [TransactionDate])

                OUTPUT inserted.[TransactionId], inserted.[SalesId], inserted.[TotalAmount], inserted.[PaymentType], inserted.[TransactionStatus], inserted.[TransactionDate]

                INTO @TempTransactionItems ([TransactionId], [SalesId], [TotalAmount], [PaymentType], [TransactionStatus], [TransactionDate])

				SELECT s.[SalesId], a.[TotalAmount], a.[PaymentType], a.[TransactionStatus], a.[TransactionDate] FROM @TransactionItems a cross join @TempSalesItems s --on a.SalesId = s.SalesId
                WHERE  a.TransactionId = 0 AND a.IsDeleted = 0 and s.[SalesId] is not null

				
				INSERT INTO [dbo].[SalesDetails] ([SalesId], [ProductId], [Quantity], [UnitPrice], [TotalPrice])
				SELECT s.SalesId, [ProductId], [Quantity], [UnitPrice], [TotalPrice] FROM @SalesDetailsItems a
				cross join @TempSalesItems s --on a.SalesId = s.SalesId 
                WHERE  a.SalesDetailsId = 0 AND a.IsDeleted = 0 and s.[SalesId] is not null

                Select A.*
                FROM GetRawTransactionDetails  A WHERE A.TransactionId in
				(SELECT Isnull(b.TransactionId, a.TransactionId)  FROM @TransactionItems a full outer join @TempTransactionItems b ON a.TransactionId = b.TransactionId)

END
GO
/****** Object:  StoredProcedure [dbo].[SaveUser]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SaveUser] (@UserItems UserType readonly)
AS
BEGIN
                DECLARE @TempUserItems UserType
                DELETE a FROM [dbo].[User] a INNER JOIN @UserItems B ON A.UserId = B.UserId AND B.IsDeleted = 1
                
				UPDATE [dbo].[User] SET
				UserName = B.UserName,
				EncryptedAccessKey = B.EncryptedAccessKey
                FROM [dbo].[User] A INNER JOIN @UserItems B ON A.UserId = B.UserId AND B.IsDeleted = 0

                INSERT INTO [dbo].[User] ([UserName], [EncryptedAccessKey])

                OUTPUT inserted.UserId, inserted.[UserName], inserted.[EncryptedAccessKey]

                INTO @TempUserItems ([UserId],[UserName], [EncryptedAccessKey])

				SELECT [UserName], [EncryptedAccessKey] 
				FROM @UserItems a
                WHERE  a.UserId = 0 AND a.IsDeleted = 0

                Select [UserId], [UserName], [EncryptedAccessKey] 
                FROM [dbo].[User] A WHERE A.UserId in 
				(SELECT Isnull(b.UserId, a.UserId)  FROM  @UserItems a full outer join @TempUserItems b ON a.UserId = b.UserId)
END
GO
USE [master]
GO
ALTER DATABASE [ecomcommunitystore] SET  READ_WRITE 
GO
