const config = {
    url: 'https://api.recursionist.io/builder/computers?type=',
    cpu: "cpuTarget",
    gpu: "gpuTarget",
    ram: "ramTarget",
    storage: "storageTarget",
    addBtn: "addBtn"
}

function setDefaultOption() {
    return "<option>-</option>";
}

const cpuBrand = document.getElementById("cpuBrand");
const gpuBrand = document.getElementById("gpuBrand");
const ramAmount = document.getElementById("ramAmount");
const ramBrand = document.getElementById("ramBrand");
const storageType = document.getElementById("storageType");
const storageAmount = document.getElementById("storageAmount");
const storageBrand = document.getElementById("storageBrand");

// CPU
cpuBrand.addEventListener("change", () => {
    const target = document.getElementById(config.cpu);

    target.innerHTML = setDefaultOption();
    target.innerHTML += listModel(target, "cpu", cpuBrand.value);
});

// GPU
gpuBrand.addEventListener("change", () => {
    const target = document.getElementById(config.gpu);
    
    target.innerHTML = setDefaultOption();
    target.innerHTML += listModel(target, "gpu", gpuBrand.value);
});

// MEMORY
ramAmount.addEventListener("change", () => {
    ramBrand.selectedIndex = 0;
    document.getElementById(config.ram).innerHTML = setDefaultOption();
});

ramBrand.addEventListener("change", () => {
    const target = document.getElementById(config.ram);

    target.innerHTML = setDefaultOption();
    target.innerHTML += listRamModel(target, ramAmount.value, ramBrand.value);
});

// Storage
storageType.addEventListener("change", () => {
    storageAmount.selectedIndex = 0;
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

// add PCボタンが押されたとき
document.getElementById(config.addBtn).addEventListener("click", () => {
    let models = document.querySelectorAll(".model");
    let numOfPc = document.getElementById(config.addBtn).getAttribute("data-times");

    document.getElementById("displayTarget").innerHTML +=
    `
        <h1 class="py-4 text-center bg-warning"><strong>Your PC${numOfPc}</strong></h1>
        <div class="px-5 p-3 col-5">
            <h1>CPU</h1>
            <h4>Brand: </h4>
            <h4>Model: </h4>
        </div>
        <div class="px-5 p-3 col-5">
            <h1>GPU</h1>
            <h4>Brand: </h4>
            <h4>Model: </h4>
        </div>
        <div class="px-5 p-3 col-5">
            <h1>RAM</h1>
            <h4>Brand: </h4>
            <h4>Model: </h4>
        </div>
        <div class="px-5 p-3 col-5">
            <h1>Storage</h1>
            <h4>Disk: </h4>
            <h4>Storage: </h4>
            <h4>Brand: </h4>
            <h4>Model: </h4>
        </div>
        <div class="d-flex justify-content-around aling-items-center py-4">
            <h1>Gaming: %</h1>
            <h1>Work: %</h1>
        </div>
    `;

    numOfPc = parseInt(numOfPc) + 1;
    addBtn.setAttribute("data-times", numOfPc);
});

function listModel(target, type, brand) {

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