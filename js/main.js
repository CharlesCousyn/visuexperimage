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

                updateSelects(fileJSON);

                //Listener select criterion
                const selectCriterion = document.getElementById("selectCriterion");
                selectCriterion.addEventListener("change",
                        () =>
                        {
                            loadedConfig = fileJSON[selectCriterion.options[selectCriterion.selectedIndex].value];
                            console.log("loadedConfig", loadedConfig);
                            chart(loadedConfig);
                        });

                //Listener select criterion
                const selectConfig = document.getElementById("selectConfig");
                selectConfig.addEventListener("change",
                    () =>
                    {
                        loadedConfig = fileJSON.perCombination.find(combConf => combConf.combination === selectConfig.options[selectConfig.selectedIndex].value).config;
                        console.log("loadedConfig", loadedConfig);
                        chart(loadedConfig);
                    })
            };

            reader.readAsText(file);
        });
});

function updateSelects(fileJson)
{
    //Update select criterion
    const selectCriterion = document.getElementById("selectCriterion");
    let optionsHTMLCriterion = ["<option value='' selected disabled hidden>Choose Criterion</option>", ...Object.keys(fileJson).filter(key => key !== "perCombination").map(key => `<option value='${key}'> ${key}</option>`)];
    selectCriterion.innerHTML = optionsHTMLCriterion.join("");

    //Update select config
    const selectConfig = document.getElementById("selectConfig");
    let optionsHTMLConfig = ["<option value='' selected disabled hidden>Choose config</option>", fileJson.perCombination.map(combConf => `<option value='${combConf.combination}'> ${combConf.combination}</option>`)];
    selectConfig.innerHTML = optionsHTMLConfig.join("");
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