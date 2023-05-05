const config = {
    url: 'https://api.recursionist.io/builder/computers?type=',
    cpu: "cpuTarget",
    gpu: "gpuTarget",
    ram: "ramTarget",
}

const cpuBrand = document.getElementById("cpuBrand");
const gpuBrand = document.getElementById("gpuBrand");
const ramAmount = document.getElementById("ramAmount");
const ramBrand = document.getElementById("ramBrand");

// CPU
cpuBrand.addEventListener("change", () => {
    const target = document.getElementById(config.cpu);
    const selectedBrand = cpuBrand.value;

    target.innerHTML = `<option>-</option>`;
    target.innerHTML += listModel(target, "cpu", selectedBrand);
});

// GPU
gpuBrand.addEventListener("change", () => {
    const target = document.getElementById(config.gpu);
    const selectedBrand = gpuBrand.value;
    
    target.innerHTML = `<option>-</option>`;
    target.innerHTML += listModel(target, "gpu", selectedBrand);
});

// MEMORY
ramAmount.addEventListener("change", () => {
    const selectedAmount = ramAmount.value;

    ramBrand.selectedIndex = 0;
    ramBrand.addEventListener("change", () => {
        const target = document.getElementById(config.ram);
        const selectedBrand = ramBrand.value;

        
    });
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