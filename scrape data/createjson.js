const { faker } = require("@faker-js/faker");
const { penyakit, pekerjaan, provinsi } = require("./rawdata.json");
const { buildInsertSQL } = require("./sqlBuilder");

/* CREATE PROVINSI */
createProvinsi = async () => {
  dataProvinsi = provinsi.map((e, idx) => {
    return {
      IDProvinsi: idx + 1,
      Nama: e,
    };
  });
  console.log(dataProvinsi);
  await buildInsertSQL(dataProvinsi, "Provinsi");
};

/* CREATE PENDUDUK */
// `NIK` VARCHAR(16) NOT NULL,
// `NamaDepan` VARCHAR(128),
// `NamaBelakang` VARCHAR(128),
// `TanggalLahir` DATE,
// `Kategori` VARCHAR(128),
// `JenisKelamin` VARCHAR(1),
// `Pekerjaan` VARCHAR(128),
// PRIMARY KEY (`NIK`)
// https://dindukcapil.rembangkab.go.id/data/pekerjaan
const createPenduduk = async () => {
  pilihanKategori = ["tenaga kesehatan", "lanjut usia", "petugas publik", "masyarakat umum"];
  pilihanPekerjaan = [];
  dataPenduduk = [];

  //do this for 100 times
  for (let i = 1; i <= 100; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const randomPhoneNumber = faker.phone.phoneNumber();
    const randomGender = faker.random.arrayElement(["L", "P"]);
    //random date
    const randomDate = faker.date.between("1950-01-01", "2000-12-31");
    const randomKategori = faker.random.arrayElement(pilihanKategori);
    const randomPekerjaan = faker.random.arrayElement(pekerjaan).PEKERJAAN;
    let iToStr;
    if (i < 10) {
      iToStr = "00" + i;
    } else if (i < 100) {
      iToStr = "0" + i;
    } else {
      iToStr = i;
    }
    const NIK = "1234512345123" + iToStr;
    penduduk = {
      NIK: NIK,
      NamaDepan: firstName,
      NamaBelakang: lastName,
      TanggalLahir: randomDate,
      Kategori: randomKategori,
      JenisKelamin: randomGender,
      Pekerjaan: randomPekerjaan,
    };
    // add penduduk to data penduduk
    dataPenduduk = [...dataPenduduk, penduduk];
  }
  console.log(dataPenduduk);
  await buildInsertSQL(dataPenduduk, "Penduduk");
};

/* CREATE PENYAKIT PENDUDUK */
// CREATE TABLE `PenyakitPenduduk` (
//   `IDPenyakit` INT NOT NULL,
//   `NIK` VARCHAR(16) NOT NULL,
//   PRIMARY KEY (`IDPenyakit`, `NIK`),
//   FOREIGN KEY (`IDPenyakit`) REFERENCES `Penyakit` (`IDPenyakit`),
//   FOREIGN KEY (`NIK`) REFERENCES `Penduduk` (`NIK`)
// );
createPenyakitPenduduk = async () => {
  dataPenyakitPenduduk = [];
  for (i = 1; i <= 100; i++) {
    // id penyakit random dari 1 hingga 100
    const randomPenyakit = faker.random.number({ min: 1, max: 100 });
    // nik random antara 1 sampe 100
    const randomNIK = faker.random.number({ min: 1, max: 100 });
    if (randomNIK < 10) {
      NIKstr = "00" + randomNIK;
    } else if (randomNIK < 100) {
      NIKstr = "0" + randomNIK;
    } else {
      NIKstr = randomNIK;
    }
    NIKstr = "1234512345123" + NIKstr;
    penyakitPenduduk = {
      IDPenyakit: randomPenyakit,
      NIK: NIKstr,
    };
    dataPenyakitPenduduk = [...dataPenyakitPenduduk, penyakitPenduduk];
  }
  console.log(dataPenyakitPenduduk);
  await buildInsertSQL(dataPenyakitPenduduk, "PenyakitPenduduk");
};
/* CREATE PENYAKIT */

// CREATE TABLE `Penyakit` (
//   `IDPenyakit` INT NOT NULL AUTO_INCREMENT,
//   `Nama` VARCHAR(128),
//   PRIMARY KEY (`IDPenyakit`)
// );
createPenyakit = async () => {
  console.log(penyakit);
  dataPenyakit = penyakit.map((e, idx) => {
    return {
      IDPenyakit: idx + 1,
      Nama: e.disease,
    };
  });
  console.log(dataPenyakit);
  await buildInsertSQL(dataPenyakit, "Penyakit");
};

/* CREATE VAKSIN */
// CREATE TABLE `Vaksin` (
//   `IDVaksin` INT NOT NULL AUTO_INCREMENT,
//   `Nama` VARCHAR(128),
//   `Produsen` VARCHAR(128),
//   PRIMARY KEY (`IDVaksin`)
// );
createVaksin = async () => {
  vaksin = ["BioNTech", "CoronaVac", "Moderna", "Novavax", "Oxford", "Sinopharm", "Sputnik V", "CanSino", "Janssen", "RBD - Dimer"];
  dataVaksin = vaksin.map((e, idx) => {
    return {
      IDVaksin: idx + 1,
      Nama: e,
      Produsen: faker.address.country(),
    };
  });
  console.log(dataVaksin);
  await buildInsertSQL(dataVaksin, "Vaksin");
};
/* CREATE NO TELP PENDUDUK */
// CREATE TABLE `NoTelpPenduduk` (
//   `NIK` VARCHAR(16),
//   `NoTelp` VARCHAR(16),
//   PRIMARY KEY (`NIK`, `NoTelp`),
//   FOREIGN KEY (`NIK`) REFERENCES `Penduduk`(`NIK`)
// );
createNoTelpPenduduk = async () => {
  dataNoTelpPenduduk = [];
  for (i = 1; i <= 100; i++) {
    // nik random antara 1 sampe 100
    const randomNIK = faker.random.number({ min: 1, max: 100 });
    if (randomNIK < 10) {
      NIKstr = "00" + randomNIK;
    } else if (randomNIK < 100) {
      NIKstr = "0" + randomNIK;
    } else {
      NIKstr = randomNIK;
    }
    NIKstr = "1234512345123" + NIKstr;
    const randomNoTelp = faker.phone.phoneNumber();
    noTelpPenduduk = {
      NIK: NIKstr,
      NoTelp: randomNoTelp,
    };
    dataNoTelpPenduduk = [...dataNoTelpPenduduk, noTelpPenduduk];
  }
  console.log(dataNoTelpPenduduk);
  await buildInsertSQL(dataNoTelpPenduduk, "NoTelpPenduduk");
};

/* CREATE PENYUNTIKAN VAKSIN */
// CREATE TABLE `PenyuntikanVaksin` (
//   `NIK` VARCHAR(128) NOT NULL,
//   `Tahap` INT NOT NULL,
//   `Tanggal` DATE,
//   `IDBatch` INT NOT NULL,
//   PRIMARY KEY (`NIK`, `Tahap`),
//   FOREIGN KEY (`NIK`) REFERENCES `Penduduk` (`NIK`),
//   FOREIGN KEY (`IDBatch`) REFERENCES `Batch` (`IDBatch`)
// );
createPenyuntikanVaksin = async () => {
  dataPenyuntikanVaksin = [];
  // NIK tidak boleh muncul 2x;
  const NIKs = [];
  // 34 sudah vaksin sekali, 33 sudah 2x, 33 sudah 3x. jadi totalnya 34 + 33*2 + 33*3 =199
  for (i = 1; i <= 100; i++) {
    // nik random antara 1 sampe 100
    isBerhasil = false;
    while (!isBerhasil) {
      const randomNIK = faker.random.number({ min: 1, max: 100 });
      if (randomNIK < 10) {
        NIKstr = "00" + randomNIK;
      } else if (randomNIK < 100) {
        NIKstr = "0" + randomNIK;
      } else {
        NIKstr = randomNIK;
      }
      NIKstr = "1234512345123" + NIKstr;
      if (NIKs.includes(NIKstr)) {
      } else {
        isBerhasil = true;
        NIKs.push(NIKstr);
        if (i <= 34) {
          const randomTanggal = faker.date.past();
          const randomIDBatch = faker.random.number({ min: 1, max: 100 });
          penyuntikanVaksin = {
            NIK: NIKstr,
            Tahap: 1,
            Tanggal: randomTanggal,
            IDBatch: randomIDBatch,
          };
          dataPenyuntikanVaksin = [...dataPenyuntikanVaksin, penyuntikanVaksin];
        } else if (i <= 67) {
          // lakukan 2x
          for (j = 1; j <= 2; j++) {
            const randomTanggal = faker.date.past();
            const randomIDBatch = faker.random.number({ min: 1, max: 100 });
            penyuntikanVaksin = {
              NIK: NIKstr,
              Tahap: j,
              Tanggal: randomTanggal,
              IDBatch: randomIDBatch,
            };
            dataPenyuntikanVaksin = [...dataPenyuntikanVaksin, penyuntikanVaksin];
          }
        } else if (i <= 100) {
          // lakukan 3x
          for (j = 1; j <= 3; j++) {
            const randomTanggal = faker.date.past();
            const randomIDBatch = faker.random.number({ min: 1, max: 100 });
            penyuntikanVaksin = {
              NIK: NIKstr,
              Tahap: j,
              Tanggal: randomTanggal,
              IDBatch: randomIDBatch,
            };
            dataPenyuntikanVaksin = [...dataPenyuntikanVaksin, penyuntikanVaksin];
          }
        }
      }
    }
  }
  console.log(dataPenyuntikanVaksin);
  await buildInsertSQL(dataPenyuntikanVaksin, "PenyuntikanVaksin");
};
// PANGGIL FUNGSI
// createProvinsi();
createPenduduk();
createPenyakitPenduduk();
// createPenyakit();
// createNoTelpPenduduk();
createVaksin();
createPenyuntikanVaksin();
