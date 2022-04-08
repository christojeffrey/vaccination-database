const fs = require("fs");
const dbf_parser = require("dbf-parser");
const csv = require("csvtojson");
const https = require("https");
const { chunk } = require("underscore");
const { URL } = require("url");
const {buildInsertSQL} = require("./sqlBuilder");

const KOTAKABCOUNTS = 514;
const FASKESTYPE = [`RUMAH SAKIT`, `PUSKESMAS`, `KLINIK`];
const KEPEMILIKAN_RS = [`SWASTA`, `NEGERI`];
const KELAS_RS = [`I`, `II`, `III`];
const KELAS_KLINIK = [`UTAMA`, `PRATAMA`];
const KELAS_PUSKESMAS = [`UTAMA`, `PRATAMA`];
const TELEPHONE_NUMBER_FRONT = ["021","082","083"];

// run with faskes
function createRandomTelpNum() {
  let tlp = TELEPHONE_NUMBER_FRONT[randomWithMax(TELEPHONE_NUMBER_FRONT.length - 1)];
  for (let i = 0; i < 9; i++) {
    tlp += `${randomWithMax(9)}`
  }
  return tlp;
}

function buildKotaKabupaten() {
  let dataJson = "";
  let data;
  let processedData = [];
  let provinceData;
  let url = new URL(
    "https://raw.githubusercontent.com/averrous-s/cek-jaringan-indohome/main/data/regions.json"
  );
  let req = https.request(url, (res) => {
    res.on("data", (chunk) => {
      dataJson += chunk;
    });

    res.on("end", async () => {
      data = JSON.parse(dataJson);
      // sort untuk menyamakan indeks
      provinceData = data.map((e) => e.provinsi).sort();
      // puter data
      data.forEach((e) => {
        let tmp;
        let nameArr;
        let idProvince = provinceData.findIndex((p) => e.provinsi == p) + 1;
        e.kota.forEach((e) => {
          nameArr = e.split(" ");
          tmp = {
            Nama:
              nameArr[0] == "Kota"
                ? e
                : "Kabupaten " + nameArr.slice(1).join(" "),
            IDProvinsi: idProvince,
          };
          processedData.push(tmp);
        });
      });

      await buildInsertSQL(processedData, "KotaKabupaten");
    });
  });

  req.on("error", function (e) {
    console.log(e.message);
  });
  req.end();
}

function buildFaskes(maxCount) {
  let data;
  let dataRS = [];
  let dataPuskesmas = [];
  let dataKlinik = [];
  let dataNoTelp = [];
  csv({ delimiter: ";" })
    .fromFile(__dirname + "\\Hospitals.csv")
    .then(async (jsonObj) => {
      //     `IDFasilitas` INT NOT NULL AUTO_INCREMENT,
      // `Nama` VARCHAR(128),
      // `KapasitasHarian` INT,
      // `Tipe` ENUM(`RUMAH SAKIT`, `PUSKESMAS`,`KLINIK`),
      // `IDKotaKabupaten` INT NOT NULL,

      data = jsonObj;
      data = data
        .filter((e) => e.Nama.split(" ").length <= 2)
        .map((e, idx) => {
          let notelpCount = randomWithMax(5);
          let tipeRandom = FASKESTYPE[randomWithMax(FASKESTYPE.length - 1)];
          let faskesData =  {
            IDFasilitas: idx + 1,
            Nama: e.Nama.split(" ").slice(1).join(" "),
            KapasitasHarian:
              tipeRandom == "RUMAH SAKIT"
                ? randomWithMax(200)
                : randomWithMax(50),
            Tipe: tipeRandom,
            IDKotaKabupaten: randomWithMax(KOTAKABCOUNTS) + 1
          };

          // faskes notelp
          for (let i = 0; i < notelpCount; i++) {
            dataNoTelp.push({
              IDFasilitas: faskesData.IDFasilitas,
              NoTelp: createRandomTelpNum()
            })
          }

          // faskes specialization
          if (tipeRandom == "RUMAH SAKIT") {
            dataRS.push(createFaskesRumahSakit(faskesData));
          } else if (tipeRandom == "KLINIK") {
            dataKlinik.push(createFaskesKlinik(faskesData));
          } else { // PUSKESMAS
            dataPuskesmas.push(createFaskesPuskesmas(faskesData));
          }

          return faskesData;
        });
      await buildInsertSQL(data, "FasilitasKesehatan");
      await buildInsertSQL(dataNoTelp, "NoTelpFasilitasKesehatan");
      await buildInsertSQL(dataKlinik, "Klinik");
      await buildInsertSQL(dataPuskesmas, "Puskesmas");
      await buildInsertSQL(dataRS, "RumahSakit");
    });
}

// run altogether in buildFaskes()
function createFaskesPuskesmas(faskesData) {
  return {
    IDFasilitas: faskesData.IDFasilitas,
    RawatInap: randomWithMax(1),
    Kelas: KELAS_PUSKESMAS[randomWithMax(KELAS_PUSKESMAS.length - 1)]
  }
}

// run altogether in buildFaskes()
function createFaskesRumahSakit(faskesData) {
  return {
    IDFasilitas: faskesData.IDFasilitas,
    Kepemilikan: KEPEMILIKAN_RS[randomWithMax(KEPEMILIKAN_RS.length - 1)],
    Kelas: KELAS_RS[randomWithMax(KELAS_RS.length-1)]
  }
}

// run altogether in buildFaskes()
function createFaskesKlinik(faskesData) {
  return {
    IDFasilitas: faskesData.IDFasilitas,
    Kelas: KELAS_KLINIK[randomWithMax(KELAS_KLINIK.length - 1)]
  }
}

const randomWithMax = (max) => {
  return Math.floor(Math.random() * (max + 1));
};



buildFaskes(-1);
buildKotaKabupaten();
