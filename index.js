const config = {
    url: 'https://api.recursionist.io/builder/computers?type=',
    cpu: "cpuTarget",
    gpu: "gpuTarget",
    ram: "ramTarget",
    storage: "storageTarget",
    addBtn: "addBtn",
    resetBtn: "resetBtn"
}

function setDefaultOption() {
    return "<option>-</option>";
}

function setDefaultIndex(ele) {
    ele.selectedIndex = 0;
}

const cpuBrand = document.getElementById("cpuBrand");
const gpuBrand = document.getElementById("gpuBrand");
const ramAmount = document.getElementById("ramAmount");
const ramBrand = document.getElementById("ramBrand");
const storageType = document.getElementById("storageType");
const storageAmount = document.getElementById("storageAmount");
const storageBrand = document.getElementById("storageBrand");

// 全ての選択欄
const models = document.querySelectorAll(".model");
// 初期状態が - の欄
const selects = document.querySelectorAll(".selects");

// CPU
cpuBrand.addEventListener("change", () => {
    const target = document.getElementById(config.cpu);

    target.innerHTML = setDefaultOption();
    target.innerHTML += listCpuGpuModel(target, "cpu", cpuBrand.value);
});

// GPU
gpuBrand.addEventListener("change", () => {
    const target = document.getElementById(config.gpu);
    
    target.innerHTML = setDefaultOption();
    target.innerHTML += listCpuGpuModel(target, "gpu", gpuBrand.value);
});

// MEMORY
ramAmount.addEventListener("change", () => {
    setDefaultIndex(ramBrand);
    document.getElementById(config.ram).innerHTML = setDefaultOption();
});

ramBrand.addEventListener("change", () => {
    const target = document.getElementById(config.ram);

    target.innerHTML = setDefaultOption();
    target.innerHTML += listRamModel(target, ramAmount.value, ramBrand.value);
});

// Storage
storageType.addEventListener("change", () => {
    setDefaultIndex(storageAmount);
    storageAmount.innerHTML += listStorageAmount(storageAmount, storageType.value);
});

storageAmount.addEventListener("change", () => {
    const target = document.getElementById("storageBrand");

    target.innerHTML = setDefaultOption();
    target.innerHTML += listStorageBrand(target, storageType.value);
});

storageBrand.addEventListener("change", () => {
    const target = document.getElementById(config.storage);

    target.innerHTML = setDefaultOption();
    target.innerHTML += listStorageModel(target, storageBrand.value);
});

// Resetボタンが押されたとき
document.getElementById(config.resetBtn).addEventListener("click", () => {
    let result = confirm("Reset All Data?");

    if (result) {
        for (let i = 0; i < selects.length; i++) {
            selects[i].innerHTML = setDefaultOption();
        }
        setDefaultIndex(cpuBrand);
        setDefaultIndex(gpuBrand);
        setDefaultIndex(ramAmount);
        setDefaultIndex(ramBrand);
        setDefaultIndex(storageType);
    } else return;
});

// addボタンが押されたとき
document.getElementById(config.addBtn).addEventListener("click", () => {
    for (let i = 0; i < models.length; i++) {
        if (models[i].value == "-") {
            alert("Please fill in all forms.");
            return;
        }
    }

    let numOfPc = document.getElementById(config.addBtn).getAttribute("data-times");
    const storageTypeValue = storageType.value == "hdd" ? "HDD" : "SSD";

    document.getElementById("displayTarget").innerHTML +=
    `
        <h1 class="py-4 text-center bg-warning"><strong>Your PC${numOfPc}</strong></h1>
        <div class="px-5 p-3 col-5">
            <h1>CPU</h1>
            <h4>Brand: ${cpuBrand.value}</h4>
            <h4>Model: ${document.getElementById(config.cpu).value}</h4>
        </div>
        <div class="px-5 p-3 col-5">
            <h1>GPU</h1>
            <h4>Brand: ${gpuBrand.value}</h4>
            <h4>Model: ${document.getElementById(config.gpu).value}</h4>
        </div>
        <div class="px-5 p-3 col-5">
            <h1>RAM</h1>
            <h4>Brand: ${ramBrand.value}</h4>
            <h4>Model: ${document.getElementById(config.ram).value}</h4>
        </div>
        <div class="px-5 p-3 col-5">
            <h1>Storage</h1>
            <h4>Disk: ${storageTypeValue}</h4>
            <h4>Storage: ${storageAmount.value}</h4>
            <h4>Brand: ${storageBrand.value}</h4>
            <h4>Model: ${document.getElementById(config.storage).value}</h4>
        </div>
        <div class="d-flex justify-content-around aling-items-center py-4 bg-info">
            <h1 class="gamingScore">Gaming: </h1>
            <h1 class="workScore">Work: </h1>
        </div>
    `;

    calcuratebenchmark("gaming").then((result) => {
        const elements = document.querySelectorAll(".gamingScore").length;
        document.querySelectorAll(".gamingScore")[elements - 1].textContent += `${result}%`;
    });

    calcuratebenchmark("work").then((result) => {
        const elements = document.querySelectorAll(".gamingScore").length;
        document.querySelectorAll(".workScore")[elements - 1].textContent += `${result}%`;
    });

    numOfPc = parseInt(numOfPc) + 1;
    addBtn.setAttribute("data-times", numOfPc);

    alert("Added Your PC!");
});

function listCpuGpuModel(target, type, brand) {

    fetch(`${config.url}${type}`).then(response => response.json()).then(data => {
        for (let key in data) {
            let current = data[key];
            if (current.Brand == brand) target.innerHTML += `<option>${current.Model}</option>`;
        }
    });

    return target;
}

function listRamModel(target, amount, brand) {
    fetch(`${config.url}ram`).then(response => response.json()).then(data => {
        for (let key in data) {
            let current = data[key];
            if (judgeRamCondition(current, amount, brand)) target.innerHTML += `<option>${current.Model}</option>`;
        }
    });

    return target;
}

function listStorageAmount(target, type) {
    let hashMap = new Map();
  
    fetch(`${config.url}${type}`).then(response => response.json()).then(data => {
      for (let key in data) {
        let current = data[key];
        let amount = getStorageAmount(current.Model);
  
        if (hashMap.get(amount) == undefined) {
            hashMap.set(amount, 1);
            target.innerHTML += `<option value="${amount}">${amount}</option>`;
        }
      }
  
      // Mapから配列に変換して、値に基づいて降順にソートする
      let sortedArray = Array.from(hashMap).sort((a, b) => {
        let [aAmount, aUnit] = a[0].split(/(?<=\d)(?=[A-Z])/);
        let [bAmount, bUnit] = b[0].split(/(?<=\d)(?=[A-Z])/);
  
        aAmount = parseFloat(aAmount);
        bAmount = parseFloat(bAmount);
  
        if (aUnit === "TB" && bUnit === "GB") return -1;
        else if (aUnit === "GB" && bUnit === "TB") return 1;
        else return bAmount - aAmount;
      });
  
      // ソートされた配列から、HTML要素のoptionを再構築する
      target.innerHTML = `<option>-</option>`;
      sortedArray.forEach(([amount, count]) => {
        target.innerHTML += `<option value="${amount}">${amount}</option>`;
      });
    });
  
    return target;
}

function listStorageBrand(target, type) {
    let hashMap = new Map();

    fetch(`${config.url}${type}`).then(response => response.json()).then(data => {
        for (let key in data) {
            let current = data[key];
            if (hashMap.get(current.Brand) == undefined) {
                hashMap.set(current.Brand, 1);
                target.innerHTML += `<option value="${current.Brand}">${current.Brand}</option>`;
            }
        }
    })

    return target;
}

function listStorageModel(target, brand) {
    fetch(`${config.url}${storageType.value}`).then(response => response.json()).then(data => {
        for (let key in data) {
            let current = data[key];
            let amount = getStorageAmount(current.Model);

            if (current.Brand == brand && amount === storageAmount.value) target.innerHTML += `<option>${current.Model}</option>`;
        }
    });

    return target;
}

async function calcuratebenchmark(type) {
    const parts = ["cpu", "gpu", "ram", storageType.value];
    const partsConfig = ["cpu", "gpu", "ram", "storage"];
    const promises = [];
  
    for (let i = 0; i < parts.length; i++) {
      promises.push(
        fetch(`${config.url}${parts[i]}`).then((response) => response.json()).then((data) => {
            for (let key in data) {
              if (document.getElementById(`${partsConfig[i]}Target`).value == data[key].Model) return data[key].Benchmark;
            }
            return null;
          })
      );
    }
    
    const benchmarks = await Promise.all(promises);
    return calcuratebenchmarkHelper(benchmarks, type, storageType.value);
}

function calcuratebenchmarkHelper(arr, type, storage) {
    let cpuWeight = 0;
    let gpuWeight = 0;
    let ramWeight = 0;
    let storageWeight = 0;

    if (type == "gaming") {
        cpuWeight = 0.25;
        gpuWeight = 0.6;
        ramWeight = 0.125;
        storageWeight = storage == "hdd" ? 0.025 : 0.1;
    } else if (type == "work") {
        cpuWeight = 0.6;
        gpuWeight = 0.25;
        ramWeight = 0.1;
        storageWeight = 0.05;
    }

    return Math.floor(arr[0] * cpuWeight + arr[1] * gpuWeight + arr[2] * ramWeight + arr[3] * storageWeight);
}

// モデルの中から'〇〇TB'、'〇〇GB'だけ取得
function getStorageAmount(product) {
    return product.includes("TB") ? product.match(/\d+TB|\d+\.\d+TB/)[0] : product.match(/\d+GB|\d+\.\d+GB/)[0];
}

function judgeRamCondition(product, amount, brand) {
    return product.Model.split(' ')[countSpace(product.Model)].substring(0, 1) == amount && product.Brand == brand;
}

function countSpace(model) {
    let res = 0;
    for (let i = 0; i < model.length; i++) {
        if (model[i] == " ") res++;
    }
    return res;
}