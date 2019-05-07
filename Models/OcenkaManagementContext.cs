using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ocenka_management.Models
{
    public partial class OcenkaManagementContext : DbContext
    {
        public OcenkaManagementContext()
        {
        }

        public OcenkaManagementContext(DbContextOptions<OcenkaManagementContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AddressSet> AddressSet { get; set; }
        public virtual DbSet<AppraiserContract> AppraiserContract { get; set; }
        public virtual DbSet<ClientSet> ClientSet { get; set; }
        public virtual DbSet<ClientSetEntity> ClientSetEntity { get; set; }
        public virtual DbSet<ClientSetIndividual> ClientSetIndividual { get; set; }
        public virtual DbSet<ContractSet> ContractSet { get; set; }
        public virtual DbSet<NeuralSettingsSet> NeuralSettingsSet { get; set; }
        public virtual DbSet<ObjectSet> ObjectSet { get; set; }
        public virtual DbSet<ObjectSetCar> ObjectSetCar { get; set; }
        public virtual DbSet<ObjectSetFlat> ObjectSetFlat { get; set; }
        public virtual DbSet<ObjectSetParcel> ObjectSetParcel { get; set; }
        public virtual DbSet<RolesSet> RolesSet { get; set; }
        public virtual DbSet<SalarySettingsSet> SalarySettingsSet { get; set; }
        public virtual DbSet<UserSet> UserSet { get; set; }
        public virtual DbSet<UserSetAccountant> UserSetAccountant { get; set; }
        public virtual DbSet<UserSetAppraiser> UserSetAppraiser { get; set; }
        public virtual DbSet<UserSetDirector> UserSetDirector { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseSqlServer("Server=ILYA-PC;Database=Ocenka Management;Trusted_Connection=True;");
//            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AddressSet>(entity =>
            {
                entity.Property(e => e.City).IsRequired();

                entity.Property(e => e.District).IsRequired();

                entity.Property(e => e.Street).IsRequired();
            });

            modelBuilder.Entity<AppraiserContract>(entity =>
            {
                entity.HasKey(e => new { e.AppraiserId, e.ContractId });

                entity.HasIndex(e => e.ContractId)
                    .HasName("IX_FK_AppraiserContract_Contract");

                entity.Property(e => e.AppraiserId).HasColumnName("Appraiser_Id");

                entity.Property(e => e.ContractId).HasColumnName("Contract_Id");

                entity.HasOne(d => d.Appraiser)
                    .WithMany(p => p.AppraiserContract)
                    .HasForeignKey(d => d.AppraiserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppraiserContract_Appraiser");

                entity.HasOne(d => d.Contract)
                    .WithMany(p => p.AppraiserContract)
                    .HasForeignKey(d => d.ContractId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppraiserContract_Contract");
            });

            modelBuilder.Entity<ClientSetEntity>(entity =>
            {
                entity.ToTable("ClientSet_Entity");

                entity.HasIndex(e => e.LegalAddressId)
                    .HasName("IX_FK_AddressEntity1");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Bin).HasColumnName("BIN");

                entity.Property(e => e.CompanyName).IsRequired();

                entity.Property(e => e.Inn).HasColumnName("INN");

                entity.Property(e => e.LegalAddressId).HasColumnName("LegalAddress_Id");

                entity.Property(e => e.PaymentAccount).IsRequired();

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.ClientSetEntity)
                    .HasForeignKey<ClientSetEntity>(d => d.Id)
                    .HasConstraintName("FK_Entity_inherits_Client");

                entity.HasOne(d => d.LegalAddress)
                    .WithMany(p => p.ClientSetEntity)
                    .HasForeignKey(d => d.LegalAddressId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AddressEntity1");
            });

            modelBuilder.Entity<ClientSetIndividual>(entity =>
            {
                entity.ToTable("ClientSet_Individual");

                entity.HasIndex(e => e.AddressOfResidenceId)
                    .HasName("IX_FK_IndividualAdress");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.AddressOfResidenceId).HasColumnName("AddressOfResidence_Id");

                entity.Property(e => e.DateOfBirth).HasColumnType("datetime");

                entity.Property(e => e.DateOfIssue).HasColumnType("datetime");

                entity.Property(e => e.IssuedBy).IsRequired();

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Patronymic).IsRequired();

                entity.Property(e => e.Surname).IsRequired();

                entity.HasOne(d => d.AddressOfResidence)
                    .WithMany(p => p.ClientSetIndividual)
                    .HasForeignKey(d => d.AddressOfResidenceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_IndividualAdress");

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.ClientSetIndividual)
                    .HasForeignKey<ClientSetIndividual>(d => d.Id)
                    .HasConstraintName("FK_Individual_inherits_Client");
            });

            modelBuilder.Entity<ContractSet>(entity =>
            {
                entity.HasIndex(e => e.ClientId)
                    .HasName("IX_FK_ClientContract");

                entity.HasIndex(e => e.ObjectId)
                    .HasName("IX_FK_ObjectEvaluationContract");

                entity.Property(e => e.ClientId).HasColumnName("Client_Id");

                entity.Property(e => e.FinishDate).HasColumnType("datetime");

                entity.Property(e => e.Number).IsRequired();

                entity.Property(e => e.ObjectId).HasColumnName("Object_Id");

                entity.Property(e => e.Stage).IsRequired();

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.ContractSet)
                    .HasForeignKey(d => d.ClientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ClientContract");

                entity.HasOne(d => d.Object)
                    .WithMany(p => p.ContractSet)
                    .HasForeignKey(d => d.ObjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ObjectEvaluationContract");
            });

            modelBuilder.Entity<NeuralSettingsSet>(entity =>
            {
                entity.Property(e => e.Gdp).HasColumnName("GDP");

                entity.Property(e => e.Rts).HasColumnName("RTS");
            });

            modelBuilder.Entity<ObjectSet>(entity =>
            {
                entity.Property(e => e.AimOfEvaluation).IsRequired();
            });

            modelBuilder.Entity<ObjectSetCar>(entity =>
            {
                entity.ToTable("ObjectSet_Car");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.LicenseNumber).IsRequired();

                entity.Property(e => e.Mark).IsRequired();

                entity.Property(e => e.Model).IsRequired();

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.ObjectSetCar)
                    .HasForeignKey<ObjectSetCar>(d => d.Id)
                    .HasConstraintName("FK_Car_inherits_Object");
            });

            modelBuilder.Entity<ObjectSetFlat>(entity =>
            {
                entity.ToTable("ObjectSet_Flat");

                entity.HasIndex(e => e.AddressId)
                    .HasName("IX_FK_FlatAddress");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.AddressId).HasColumnName("Address_Id");

                entity.HasOne(d => d.Address)
                    .WithMany(p => p.ObjectSetFlat)
                    .HasForeignKey(d => d.AddressId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FlatAddress");

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.ObjectSetFlat)
                    .HasForeignKey<ObjectSetFlat>(d => d.Id)
                    .HasConstraintName("FK_Flat_inherits_Object");
            });

            modelBuilder.Entity<ObjectSetParcel>(entity =>
            {
                entity.ToTable("ObjectSet_Parcel");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.UsageType).IsRequired();

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.ObjectSetParcel)
                    .HasForeignKey<ObjectSetParcel>(d => d.Id)
                    .HasConstraintName("FK_Parcel_inherits_Object");
            });

            modelBuilder.Entity<RolesSet>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<UserSet>(entity =>
            {
                entity.HasIndex(e => e.RoleId)
                    .HasName("IX_FK_RolesUser");

                entity.Property(e => e.Birthday).HasColumnType("datetime");

                entity.Property(e => e.Login).IsRequired();

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Password).IsRequired();

                entity.Property(e => e.Patronymic).IsRequired();

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.Surname).IsRequired();

                entity.Property(e => e.WorksSince).HasColumnType("datetime");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserSet)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RolesUser");
            });

            modelBuilder.Entity<UserSetAccountant>(entity =>
            {
                entity.ToTable("UserSet_Accountant");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.UserSetAccountant)
                    .HasForeignKey<UserSetAccountant>(d => d.Id)
                    .HasConstraintName("FK_Accountant_inherits_User");
            });

            modelBuilder.Entity<UserSetAppraiser>(entity =>
            {
                entity.ToTable("UserSet_Appraiser");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Position).IsRequired();

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.UserSetAppraiser)
                    .HasForeignKey<UserSetAppraiser>(d => d.Id)
                    .HasConstraintName("FK_Appraiser_inherits_User");
            });

            modelBuilder.Entity<UserSetDirector>(entity =>
            {
                entity.ToTable("UserSet_Director");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.UserSetDirector)
                    .HasForeignKey<UserSetDirector>(d => d.Id)
                    .HasConstraintName("FK_Director_inherits_User");
            });
        }
    }
}
