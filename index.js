const config = {
    url: 'https://api.recursionist.io/builder/computers?type=',
    cpu: "cpuTarget",
    gpu: "gpuTarget",
    ram: "ramTarget",
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
const storageModel = document.getElementById("storageModel");

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

    storageAmount.innerHTML = setDefaultOption();
    storageAmount.innerHTML += listStorageAmount(storageType.value);
    // storageAmount.innerHTML += sample(storageAmount, storageType.value);
});

storageAmount.addEventListener("change", () => {
    const target = document.getElementById("storageBrand");

    target.innerHTML = setDefaultOption();
    target.innerHTML += listStorageBrand(target, storageType.value);
});

storageBrand.addEventListener("change", () => {
    const target = document.getElementById("storageModel");

    target.innerHTML = setDefaultOption();
    target.innerHTML += listStorageModel(target, storageBrand.value);
})

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

// function sample(target, type) {
//     let hashMap = new Map();

//     fetch(`${config.url}${type}`).then(response => response.json()).then(data => {
//         for (let key in data) {
//             let current = data[key];
//             if (hashMap.get(current.Model) == undefined) {
//                 hashMap.set()
//             }
//         }
//     });

//     return target;
// }

function listStorageAmount(type) {
    let htmlString;
    if (type == "hdd") {
        htmlString =
        `
            <option value="12TB">12TB</option>
            <option value="10TB">10TB</option>
            <option value="8TB">8TB</option>
            <option value="6TB">6TB</option>
            <option value="5TB">5TB</option>
            <option value="4TB">4TB</option>
            <option value="3TB">3TB</option>
            <option value="2TB">2TB</option>
            <option value="1.5TB">1.5TB</option>
            <option value="1TB">1TB</option>
            <option value="500GB">500GB</option>
            <option value="450GB">450GB</option>
            <option value="300GB">300GB</option>
            <option value="250GB">250GB</option>
        `;
    } else if (type == "ssd") {
        htmlString =
        `
            <option value="4TB">4TB</option>
            <option value="2TB">2TB</option>
            <option value="1TB">1TB</option>
            <option value="960GB">960GB</option>
            <option value="800GB">800GB</option>
            <option value="512GB">512GB</option>
            <option value="500GB">500GB</option>
            <option value="480GB">480GB</option>
            <option value="400GB">400GB</option>
            <option value="280GB">280GB</option>
            <option value="256GB">256GB</option>
            <option value="250GB">250GB</option>
            <option value="128GB">128GB</option>
            <option value="118GB">118GB</option>
            <option value="58GB">58GB</option>
        `;
    }

    return htmlString;
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
            if (current.Brand == brand && current.Model.includes(storageAmount.value)) target.innerHTML += `<option>${current.Model}</option>`
        }
    });

    return target;
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