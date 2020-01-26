
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 05/01/2019 17:27:21
-- Generated from EDMX file: C:\Users\user\Desktop\Ocenka Management\Ocenka Management\Models\MainModel - Copy.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [Ocenka Management];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_AppraiserContract_Appraiser]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[AppraiserContract] DROP CONSTRAINT [FK_AppraiserContract_Appraiser];
GO
IF OBJECT_ID(N'[dbo].[FK_AppraiserContract_Contract]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[AppraiserContract] DROP CONSTRAINT [FK_AppraiserContract_Contract];
GO
IF OBJECT_ID(N'[dbo].[FK_IndividualAdress]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ClientSet_Individual] DROP CONSTRAINT [FK_IndividualAdress];
GO
IF OBJECT_ID(N'[dbo].[FK_AddressEntity1]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ClientSet_Entity] DROP CONSTRAINT [FK_AddressEntity1];
GO
IF OBJECT_ID(N'[dbo].[FK_FlatAddress]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ObjectEvaluationSet_Flat] DROP CONSTRAINT [FK_FlatAddress];
GO
IF OBJECT_ID(N'[dbo].[FK_ObjectEvaluationContract]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ContractSet] DROP CONSTRAINT [FK_ObjectEvaluationContract];
GO
IF OBJECT_ID(N'[dbo].[FK_ClientContract]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ContractSet] DROP CONSTRAINT [FK_ClientContract];
GO
IF OBJECT_ID(N'[dbo].[FK_Individual_inherits_Client]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ClientSet_Individual] DROP CONSTRAINT [FK_Individual_inherits_Client];
GO
IF OBJECT_ID(N'[dbo].[FK_Entity_inherits_Client]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ClientSet_Entity] DROP CONSTRAINT [FK_Entity_inherits_Client];
GO
IF OBJECT_ID(N'[dbo].[FK_Flat_inherits_ObjectEvaluation]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ObjectEvaluationSet_Flat] DROP CONSTRAINT [FK_Flat_inherits_ObjectEvaluation];
GO
IF OBJECT_ID(N'[dbo].[FK_Parcel_inherits_ObjectEvaluation]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ObjectEvaluationSet_Parcel] DROP CONSTRAINT [FK_Parcel_inherits_ObjectEvaluation];
GO
IF OBJECT_ID(N'[dbo].[FK_Car_inherits_ObjectEvaluation]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ObjectEvaluationSet_Car] DROP CONSTRAINT [FK_Car_inherits_ObjectEvaluation];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[ContractSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ContractSet];
GO
IF OBJECT_ID(N'[dbo].[AppraiserSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AppraiserSet];
GO
IF OBJECT_ID(N'[dbo].[AddressSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AddressSet];
GO
IF OBJECT_ID(N'[dbo].[ObjectEvaluationSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ObjectEvaluationSet];
GO
IF OBJECT_ID(N'[dbo].[ClientSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ClientSet];
GO
IF OBJECT_ID(N'[dbo].[ClientSet_Individual]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ClientSet_Individual];
GO
IF OBJECT_ID(N'[dbo].[ClientSet_Entity]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ClientSet_Entity];
GO
IF OBJECT_ID(N'[dbo].[ObjectEvaluationSet_Flat]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ObjectEvaluationSet_Flat];
GO
IF OBJECT_ID(N'[dbo].[ObjectEvaluationSet_Parcel]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ObjectEvaluationSet_Parcel];
GO
IF OBJECT_ID(N'[dbo].[ObjectEvaluationSet_Car]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ObjectEvaluationSet_Car];
GO
IF OBJECT_ID(N'[dbo].[AppraiserContract]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AppraiserContract];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'ContractSet'
CREATE TABLE [dbo].[ContractSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ContractSumm] float  NOT NULL,
    [StartDate] datetime  NOT NULL,
    [FinishDate] datetime  NOT NULL,
    [Prepaid] float  NOT NULL,
    [Number] nvarchar(max)  NOT NULL,
    [Stage] nvarchar(max)  NOT NULL,
    [Object_Id] int  NOT NULL,
    [Client_Id] int  NOT NULL
);
GO

-- Creating table 'AddressSet'
CREATE TABLE [dbo].[AddressSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [City] nvarchar(max)  NOT NULL,
    [District] nvarchar(max)  NOT NULL,
    [Street] nvarchar(max)  NOT NULL,
    [House] int  NOT NULL,
    [NumberOfFlat] int  NOT NULL
);
GO

-- Creating table 'ObjectSet'
CREATE TABLE [dbo].[ObjectSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [CadastralNumber] bigint  NOT NULL,
    [AimOfEvaluation] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'ClientSet'
CREATE TABLE [dbo].[ClientSet] (
    [Id] int IDENTITY(1,1) NOT NULL
);
GO

-- Creating table 'UserSet'
CREATE TABLE [dbo].[UserSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Login] nvarchar(max)  NOT NULL,
    [Password] nvarchar(max)  NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [Surname] nvarchar(max)  NOT NULL,
    [Patronymic] nvarchar(max)  NOT NULL,
    [WorksSince] datetime  NOT NULL,
    [Birthday] datetime  NOT NULL,
    [Role_Id] int  NOT NULL
);
GO

-- Creating table 'RolesSet'
CREATE TABLE [dbo].[RolesSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'SalarySettingsSet'
CREATE TABLE [dbo].[SalarySettingsSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Car] float  NOT NULL,
    [Flat] float  NOT NULL,
    [Parcel] float  NOT NULL,
    [CarPercent] float  NOT NULL,
    [FlatPercent] float  NOT NULL,
    [ParcelPercent] float  NOT NULL
);
GO

-- Creating table 'NeuralSettingsSet'
CREATE TABLE [dbo].[NeuralSettingsSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [RefinancingRate] float  NOT NULL,
    [AverageSaslary] float  NOT NULL,
    [GDP] float  NOT NULL,
    [RTS] float  NOT NULL,
    [DollarPrice] float  NOT NULL,
    [BrentPrice] float  NOT NULL,
    [EstateBuilding] float  NOT NULL,
    [CreditsAmount] float  NOT NULL
);
GO

-- Creating table 'UserSet_Appraiser'
CREATE TABLE [dbo].[UserSet_Appraiser] (
    [Position] nvarchar(max)  NOT NULL,
    [Id] int  NOT NULL
);
GO

-- Creating table 'ClientSet_Individual'
CREATE TABLE [dbo].[ClientSet_Individual] (
    [Name] nvarchar(max)  NOT NULL,
    [Surname] nvarchar(max)  NOT NULL,
    [Patronymic] nvarchar(max)  NOT NULL,
    [Series] int  NOT NULL,
    [Number] int  NOT NULL,
    [DateOfBirth] datetime  NOT NULL,
    [DateOfIssue] datetime  NOT NULL,
    [DivisionCode] int  NOT NULL,
    [IssuedBy] nvarchar(max)  NOT NULL,
    [Id] int  NOT NULL,
    [AddressOfResidence_Id] int  NOT NULL
);
GO

-- Creating table 'ClientSet_Entity'
CREATE TABLE [dbo].[ClientSet_Entity] (
    [CompanyName] nvarchar(max)  NOT NULL,
    [BIN] bigint  NOT NULL,
    [INN] bigint  NOT NULL,
    [MailAddress] nvarchar(max)  NOT NULL,
    [PaymentAccount] nvarchar(max)  NOT NULL,
    [Id] int  NOT NULL,
    [LegalAddress_Id] int  NOT NULL
);
GO

-- Creating table 'ObjectSet_Flat'
CREATE TABLE [dbo].[ObjectSet_Flat] (
    [NumberOfRooms] int  NOT NULL,
    [Area] int  NOT NULL,
    [Floor] int  NOT NULL,
    [Id] int  NOT NULL,
    [Address_Id] int  NOT NULL
);
GO

-- Creating table 'ObjectSet_Parcel'
CREATE TABLE [dbo].[ObjectSet_Parcel] (
    [Area] int  NOT NULL,
    [UsageType] nvarchar(max)  NOT NULL,
    [Id] int  NOT NULL
);
GO

-- Creating table 'ObjectSet_Car'
CREATE TABLE [dbo].[ObjectSet_Car] (
    [Mark] nvarchar(max)  NOT NULL,
    [Model] nvarchar(max)  NOT NULL,
    [LicenseNumber] nvarchar(max)  NOT NULL,
    [Year] int  NOT NULL,
    [Id] int  NOT NULL
);
GO

-- Creating table 'UserSet_Accountant'
CREATE TABLE [dbo].[UserSet_Accountant] (
    [Salary] float  NOT NULL,
    [Id] int  NOT NULL
);
GO

-- Creating table 'UserSet_Director'
CREATE TABLE [dbo].[UserSet_Director] (
    [Salary] float  NOT NULL,
    [Id] int  NOT NULL
);
GO

-- Creating table 'AppraiserContract'
CREATE TABLE [dbo].[AppraiserContract] (
    [Appraiser_Id] int  NOT NULL,
    [Contract_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'ContractSet'
ALTER TABLE [dbo].[ContractSet]
ADD CONSTRAINT [PK_ContractSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'AddressSet'
ALTER TABLE [dbo].[AddressSet]
ADD CONSTRAINT [PK_AddressSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ObjectSet'
ALTER TABLE [dbo].[ObjectSet]
ADD CONSTRAINT [PK_ObjectSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ClientSet'
ALTER TABLE [dbo].[ClientSet]
ADD CONSTRAINT [PK_ClientSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserSet'
ALTER TABLE [dbo].[UserSet]
ADD CONSTRAINT [PK_UserSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'RolesSet'
ALTER TABLE [dbo].[RolesSet]
ADD CONSTRAINT [PK_RolesSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'SalarySettingsSet'
ALTER TABLE [dbo].[SalarySettingsSet]
ADD CONSTRAINT [PK_SalarySettingsSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'NeuralSettingsSet'
ALTER TABLE [dbo].[NeuralSettingsSet]
ADD CONSTRAINT [PK_NeuralSettingsSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserSet_Appraiser'
ALTER TABLE [dbo].[UserSet_Appraiser]
ADD CONSTRAINT [PK_UserSet_Appraiser]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ClientSet_Individual'
ALTER TABLE [dbo].[ClientSet_Individual]
ADD CONSTRAINT [PK_ClientSet_Individual]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ClientSet_Entity'
ALTER TABLE [dbo].[ClientSet_Entity]
ADD CONSTRAINT [PK_ClientSet_Entity]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ObjectSet_Flat'
ALTER TABLE [dbo].[ObjectSet_Flat]
ADD CONSTRAINT [PK_ObjectSet_Flat]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ObjectSet_Parcel'
ALTER TABLE [dbo].[ObjectSet_Parcel]
ADD CONSTRAINT [PK_ObjectSet_Parcel]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ObjectSet_Car'
ALTER TABLE [dbo].[ObjectSet_Car]
ADD CONSTRAINT [PK_ObjectSet_Car]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserSet_Accountant'
ALTER TABLE [dbo].[UserSet_Accountant]
ADD CONSTRAINT [PK_UserSet_Accountant]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserSet_Director'
ALTER TABLE [dbo].[UserSet_Director]
ADD CONSTRAINT [PK_UserSet_Director]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Appraiser_Id], [Contract_Id] in table 'AppraiserContract'
ALTER TABLE [dbo].[AppraiserContract]
ADD CONSTRAINT [PK_AppraiserContract]
    PRIMARY KEY CLUSTERED ([Appraiser_Id], [Contract_Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [Appraiser_Id] in table 'AppraiserContract'
ALTER TABLE [dbo].[AppraiserContract]
ADD CONSTRAINT [FK_AppraiserContract_Appraiser]
    FOREIGN KEY ([Appraiser_Id])
    REFERENCES [dbo].[UserSet_Appraiser]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Contract_Id] in table 'AppraiserContract'
ALTER TABLE [dbo].[AppraiserContract]
ADD CONSTRAINT [FK_AppraiserContract_Contract]
    FOREIGN KEY ([Contract_Id])
    REFERENCES [dbo].[ContractSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_AppraiserContract_Contract'
CREATE INDEX [IX_FK_AppraiserContract_Contract]
ON [dbo].[AppraiserContract]
    ([Contract_Id]);
GO

-- Creating foreign key on [AddressOfResidence_Id] in table 'ClientSet_Individual'
ALTER TABLE [dbo].[ClientSet_Individual]
ADD CONSTRAINT [FK_IndividualAdress]
    FOREIGN KEY ([AddressOfResidence_Id])
    REFERENCES [dbo].[AddressSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_IndividualAdress'
CREATE INDEX [IX_FK_IndividualAdress]
ON [dbo].[ClientSet_Individual]
    ([AddressOfResidence_Id]);
GO

-- Creating foreign key on [LegalAddress_Id] in table 'ClientSet_Entity'
ALTER TABLE [dbo].[ClientSet_Entity]
ADD CONSTRAINT [FK_AddressEntity1]
    FOREIGN KEY ([LegalAddress_Id])
    REFERENCES [dbo].[AddressSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_AddressEntity1'
CREATE INDEX [IX_FK_AddressEntity1]
ON [dbo].[ClientSet_Entity]
    ([LegalAddress_Id]);
GO

-- Creating foreign key on [Address_Id] in table 'ObjectSet_Flat'
ALTER TABLE [dbo].[ObjectSet_Flat]
ADD CONSTRAINT [FK_FlatAddress]
    FOREIGN KEY ([Address_Id])
    REFERENCES [dbo].[AddressSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_FlatAddress'
CREATE INDEX [IX_FK_FlatAddress]
ON [dbo].[ObjectSet_Flat]
    ([Address_Id]);
GO

-- Creating foreign key on [Object_Id] in table 'ContractSet'
ALTER TABLE [dbo].[ContractSet]
ADD CONSTRAINT [FK_ObjectEvaluationContract]
    FOREIGN KEY ([Object_Id])
    REFERENCES [dbo].[ObjectSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ObjectEvaluationContract'
CREATE INDEX [IX_FK_ObjectEvaluationContract]
ON [dbo].[ContractSet]
    ([Object_Id]);
GO

-- Creating foreign key on [Client_Id] in table 'ContractSet'
ALTER TABLE [dbo].[ContractSet]
ADD CONSTRAINT [FK_ClientContract]
    FOREIGN KEY ([Client_Id])
    REFERENCES [dbo].[ClientSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ClientContract'
CREATE INDEX [IX_FK_ClientContract]
ON [dbo].[ContractSet]
    ([Client_Id]);
GO

-- Creating foreign key on [Role_Id] in table 'UserSet'
ALTER TABLE [dbo].[UserSet]
ADD CONSTRAINT [FK_RolesUser]
    FOREIGN KEY ([Role_Id])
    REFERENCES [dbo].[RolesSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_RolesUser'
CREATE INDEX [IX_FK_RolesUser]
ON [dbo].[UserSet]
    ([Role_Id]);
GO

-- Creating foreign key on [Id] in table 'UserSet_Appraiser'
ALTER TABLE [dbo].[UserSet_Appraiser]
ADD CONSTRAINT [FK_Appraiser_inherits_User]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[UserSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'ClientSet_Individual'
ALTER TABLE [dbo].[ClientSet_Individual]
ADD CONSTRAINT [FK_Individual_inherits_Client]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[ClientSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'ClientSet_Entity'
ALTER TABLE [dbo].[ClientSet_Entity]
ADD CONSTRAINT [FK_Entity_inherits_Client]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[ClientSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'ObjectSet_Flat'
ALTER TABLE [dbo].[ObjectSet_Flat]
ADD CONSTRAINT [FK_Flat_inherits_Object]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[ObjectSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'ObjectSet_Parcel'
ALTER TABLE [dbo].[ObjectSet_Parcel]
ADD CONSTRAINT [FK_Parcel_inherits_Object]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[ObjectSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'ObjectSet_Car'
ALTER TABLE [dbo].[ObjectSet_Car]
ADD CONSTRAINT [FK_Car_inherits_Object]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[ObjectSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'UserSet_Accountant'
ALTER TABLE [dbo].[UserSet_Accountant]
ADD CONSTRAINT [FK_Accountant_inherits_User]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[UserSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Id] in table 'UserSet_Director'
ALTER TABLE [dbo].[UserSet_Director]
ADD CONSTRAINT [FK_Director_inherits_User]
    FOREIGN KEY ([Id])
    REFERENCES [dbo].[UserSet]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------