
-- penduduk bisa pake faker 🤓👍
CREATE TABLE `Penduduk` (
  `NIK` VARCHAR(16) NOT NULL,
  `NamaDepan` VARCHAR(128),
  `NamaBelakang` VARCHAR(128),
  `TanggalLahir` DATE,
  `Kategori` VARCHAR(128),
  `JenisKelamin` VARCHAR(1),
  `Pekerjaan` VARCHAR(128),
  PRIMARY KEY (`NIK`)
);

CREATE TABLE `NoTelpPenduduk` (
  `NIK` VARCHAR(16),
  `NoTelp` VARCHAR(16),
  PRIMARY KEY (`NIK`, `NoTelp`),
  FOREIGN KEY (`NIK`) REFERENCES `Penduduk`(`NIK`)
);


-- bisa manual 🤓👍
CREATE TABLE `Provinsi` (
  `IDProvinsi` INT NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(128),
  PRIMARY KEY (`IDProvinsi`)
);

-- https://github.com/averrous-s/cek-jaringan-indohome/blob/main/data/regions.json
CREATE TABLE `KotaKabupaten` (
  `IDKotaKabupaten` INT NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(128),
  `IDProvinsi` INT NOT NULL,
  PRIMARY KEY (`IDKotaKabupaten`),
  FOREIGN KEY (`IDProvinsi`) REFERENCES `Provinsi` (`IDProvinsi`)
);

-- manual 🤓👍
CREATE TABLE `Vaksin` (
  `IDVaksin` INT NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(128),
  `Produsen` VARCHAR(128),
  PRIMARY KEY (`IDVaksin`)
);

-- https://github.com/Shivanshu-Gupta/web-scrapers/blob/master/medical_ner/medicinenet-diseases.json
CREATE TABLE `Penyakit` (
  `IDPenyakit` INT NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(128),
  PRIMARY KEY (`IDPenyakit`)
);

-- https://data.humdata.org/dataset/indonesia-health-facilities
-- CREATE TABLE `FasilitasKesehatan` (
--   `IDFasilitas` INT NOT NULL AUTO_INCREMENT,
--   `Nama` VARCHAR(128),
--   `KapasitasHarian` INT,
--   `Tipe` VARCHAR(32),
--   `IDKotaKabupaten` INT,
--   PRIMARY KEY (`IDFasilitas`)
--   FOREIGN KEY (`IDKabupaten`) REFERENCES `Kabupaten` (`IDKabupaten`)
-- );



-- 357806tanggal lahir0001
CREATE TABLE `PenyakitPenduduk` (
  `IDPenyakit` INT NOT NULL,
  `NIK` VARCHAR(16) NOT NULL,
  PRIMARY KEY (`IDPenyakit`, `NIK`),
  FOREIGN KEY (`IDPenyakit`) REFERENCES `Penyakit` (`IDPenyakit`),
  FOREIGN KEY (`NIK`) REFERENCES `Penduduk` (`NIK`)
);

-- pake js lagi
CREATE TABLE `PenyakitVaksin` (
  `IDPenyakit` INT NOT NULL,
  `IDVaksin` INT NOT NULL,
  PRIMARY KEY (`IDPenyakit`, `IDVaksin`),
  FOREIGN KEY (`IDPenyakit`) REFERENCES `Penyakit` (`IDPenyakit`),
  FOREIGN KEY (`IDVaksin`) REFERENCES `Vaksin` (`IDVaksin`)
);

-- pake js lagi


-- bikin sendiri juga


-- https://data.humdata.org/dataset/indonesia-health-facilities
-- ENUM harus pake petik yang 'kek gini'. emang gitu mariadb
CREATE TABLE `FasilitasKesehatan` (
  `IDFasilitas` INT NOT NULL AUTO_INCREMENT,
  `Nama` VARCHAR(128),
  `KapasitasHarian` INT,
  `Tipe` ENUM('RUMAH SAKIT', 'PUSKESMAS','KLINIK'), 
  `IDKotaKabupaten` INT NOT NULL,
  PRIMARY KEY (`IDFasilitas`),
  FOREIGN KEY (`IDKotaKabupaten`) REFERENCES `KotaKabupaten` (`IDKotaKabupaten`)
);

-- pake faker
CREATE TABLE `NoTelpFasilitasKesehatan` (
  `IDFasilitas` INT NOT NULL AUTO_INCREMENT,
  `NoTelp` VARCHAR(16),
  PRIMARY KEY (`IDFasilitas`, `NoTelp`),
  FOREIGN KEY (`IDFasilitas`) REFERENCES `FasilitasKesehatan` (`IDFasilitas`)
);





-- random value kita sendiri 🤓👍
CREATE TABLE `Batch` (
  `IDBatch` INT NOT NULL AUTO_INCREMENT,
  `ExpireDate` DATE,
  `IDVaksin` INT,
  `JumlahTersedia` INT,
  `JumlahTerpakai` INT,
  PRIMARY KEY (`IDBatch`),
  FOREIGN KEY (`IDVaksin`) REFERENCES `Vaksin` (`IDVaksin`)
);

CREATE TABLE `LogPengiriman` (
  `IDBatch` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(32) NOT NULL,
  `TimeStamp` DATE,
  PRIMARY KEY (`IDBatch`, `Status`),
  FOREIGN KEY (`IDBatch`) REFERENCES `Batch` (`IDBatch`)
);

CREATE TABLE `FaskesBatch` (
  `IDBatch` INT,
  `IDFasilitas` INT,
  PRIMARY KEY (`IDBatch`),
  FOREIGN KEY (`IDFasilitas`) REFERENCES `FasilitasKesehatan` (`IDFasilitas`),
  FOREIGN KEY (`IDBatch`) REFERENCES `Batch` (`IDBatch`)
);

CREATE TABLE `PenyuntikanVaksin` (
  `NIK` VARCHAR(128) NOT NULL,
  `Tahap` INT NOT NULL,
  `Tanggal` DATE,
  `IDBatch` INT NOT NULL,
  PRIMARY KEY (`NIK`, `Tahap`),
  FOREIGN KEY (`NIK`) REFERENCES `Penduduk` (`NIK`),
  FOREIGN KEY (`IDBatch`) REFERENCES `Batch` (`IDBatch`)
);


-- pake js
CREATE TABLE `RumahSakit` (
  `IDFasilitas` INT NOT NULL,
  `Kepemilikan` ENUM('SWASTA', 'NEGERI'),
  `Kelas` ENUM('I', 'II', 'III'),
  PRIMARY KEY (`IDFasilitas`),
  FOREIGN KEY (`IDFasilitas`) REFERENCES `FasilitasKesehatan` (`IDFasilitas`)
);

-- pake js
CREATE TABLE `Puskesmas` (
  `IDFasilitas` INT NOT NULL,
  `RawatInap` BIT,
  `Kelas` ENUM('UTAMA', 'PRATAMA'),
  PRIMARY KEY (`IDFasilitas`),
  FOREIGN KEY (`IDFasilitas`) REFERENCES `FasilitasKesehatan` (`IDFasilitas`)
);

-- pake js
CREATE TABLE `Klinik` (
  `IDFasilitas` INT NOT NULL,
  `Kelas` ENUM('UTAMA', 'PRATAMA'),
  PRIMARY KEY (`IDFasilitas`),
  FOREIGN KEY (`IDFasilitas`) REFERENCES `FasilitasKesehatan` (`IDFasilitas`)
);

--