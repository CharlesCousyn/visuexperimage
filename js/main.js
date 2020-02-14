let fileJSON;
let loadedConfig;
let myChart;

window.addEventListener("load",() =>
{
    console.log("fileJSON");
    document.getElementById('loadFileButton')
        .addEventListener(
        'change',
        evt =>
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                fileJSON = JSON.parse(event.target.result);

                updateSelect(fileJSON);

                const select = document.getElementById("selectCriterion");
                select.addEventListener("change",
                        () =>
                        {
                            loadedConfig = fileJSON[select.options[select.selectedIndex].value];
                            console.log("loadedConfig", loadedConfig);
                            chart(loadedConfig);
                        })
            };

            reader.readAsText(file);
        });
});

function updateSelect(fileJson)
{
    const select = document.getElementById("selectCriterion");
    let optionsHTML = ["<option value='' selected disabled hidden>Choisir ici</option>", ...Object.keys(fileJson).map(key => `<option value='${key}'> ${key}</option>`)];
    select.innerHTML = optionsHTML.join("");
}

function chart(loadedConfig)
{
    let ctx = document.getElementById('myChart').getContext('2d');
    if(myChart !== undefined)
    {
        myChart.destroy();
    }
    myChart = new Chart(ctx, loadedConfig);
}