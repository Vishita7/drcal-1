/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", () => {
   
    // Get tooltip elements and initialize them

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    $(function () {
        $('[data-bs-toggle="tooltip"]').tooltip()
      })

    
    
    // Get the toggle element and listen for changes
    document.getElementById("toggle").addEventListener("change", function () {
    // Get the form, message, radio, and program containers elements
        let form1 = document.getElementById("form1");
        let form2 = document.getElementById("form2");
        // let message = document.getElementById("messages");
        let radios = document.getElementsByName("capabilityPeriod");
        let programContainers = document.getElementsByClassName("ProgramDiv");
        let programselect = document.getElementById("programSelect");
        let resultContainerF1 = document.getElementById("resultContainerF1");

        if (this.checked) {
        form1.style.display = "block";
        form2.style.display = "none";

        // Reset form2, message, radios, and hide program containers
        form2.reset();
        } else {
        form1.style.display = "none";
        form2.style.display = "block";

        // Reset form1, message, radios, and hide program containers
        form1.reset();
        }
        
        // Reset radios
        for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
        }

        // Hide program containers
        for (let i = 0; i < programContainers.length; i++) {
            programContainers[i].style.display = "none";
        }

        // Hide program select
        programselect.style.display = "none";

        // Hide total result container
        document.getElementById("totalResultContainer").style.display = "none";
        document.getElementById("totalResultContainerF1").style.display = "none";
        document.getElementById("individualResultsCards").innerHTML = "";
    
        // Reset resultContainerF1
         resultContainerF1.innerHTML = "";

    });
    

    // Form 1
    window.onload = function () {
        // Get the radio buttons, cards, and programSelect
        let summer = document.getElementById("summer");
        let winter = document.getElementById("winter");
        let both = document.getElementById("both");
        let ConEdCSRP = document.getElementById("CSRP");
        let ConEdDLRP = document.getElementById("DLRP");
        let SCRS = document.getElementById("SCRS");
        let SCRW = document.getElementById("SCRW");
        let totalbutton = document.getElementById("total-button-container");
        let programSelect = document.getElementById("programSelect"); 

        // Listen for changes on the radio buttons
        summer.addEventListener("change", showCards);
        winter.addEventListener("change", showCards);
        both.addEventListener("change", showCards);

        function showCards() {
            // Hide all cards
            ConEdCSRP.style.display = "none";
            ConEdDLRP.style.display = "none";
            SCRS.style.display = "none";
            SCRW.style.display = "none";
            totalbutton.style.display = "none";

            // Show the appropriate cards
            if (summer.checked) {
                ConEdCSRP.style.display = "block";
                ConEdDLRP.style.display = "block";
                SCRS.style.display = "block";
                totalbutton.style.display = "block";
            } else if (winter.checked) {
                SCRW.style.display = "block";
                totalbutton.style.display = "block";
            } else if (both.checked) {
                ConEdCSRP.style.display = "block";
                ConEdDLRP.style.display = "block";
                SCRS.style.display = "block";
                SCRW.style.display = "block";
                totalbutton.style.display = "block";
            }

            // Show programSelect
            programSelect.style.display = "block";  // Add this line
        }
    };

    // document.getElementById("yourSelectElementId").addEventListener("change", toggleEventHoursInput);

    window.toggleEventHoursInput = function(value, inputId) {
        var customBox = document.getElementById(inputId);
        if (value === "custom") {
        customBox.style.display = "block";
        } else {
        customBox.style.display = "none";
        customBox.value = "";
        }
    };
    


    function displayProgramResults(messages) {
        var individualResultsCards = document.getElementById("individualResultsCards");
        individualResultsCards.innerHTML = ""; // Clear existing content
        messages.forEach(message => {
            var card = document.createElement("div");
            card.className = "col-md-6 col-lg-4 mb-4 mx-auto";
            var energyRevenueDisplay = message.energyRevenue !== undefined ? `<p class="card-text fw-bold fs-5" style="text-align: center;">Energy Revenue: $${message.energyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>` : "";
            var energyRateDisplay = message.energyRate !== undefined ? `<p class="card-text fw-bold fs-5" style="text-align: center;">Energy Rate: $${message.energyRate}/kWh</p>` : "";
            console.log('message.rate:', message.rate); // Add this
            var capacityRateDisplay = `<p class="card-text fw-bold fs-5" style="text-align: center;">Capacity Rate: $${message.rate}/kW/month</p>`;
            var capacityRevenueDisplay = `<p class="card-text fw-bold fs-5" style="text-align: center;">Capacity Revenue: $${message.capacityRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
            card.innerHTML = `
                <div class="card h-100">
                <div class="card-body">
                    <h5 class="text-center">${message.programName}</h5>
                    ${capacityRevenueDisplay}
                    ${energyRevenueDisplay}
                    ${capacityRateDisplay}
                    ${energyRateDisplay}
                </div>
                </div>
            `;
        // append the card to the parent container
        document.getElementById("individualResultsCards").appendChild(card);
        });
    }


    window.calculateTotalRevenue = function() {
        var totalRevenue = 0;
        var totalCO2Emissions = 0;
        var messages = [];

        var resultsCSRP, resultsDLRP, resultsSCRS, resultsSCRW;

        // Check which programs are selected and perform calculations
        if (document.getElementById("summer").checked || document.getElementById("both").checked) {
        // Calculate for CSRP
        resultsCSRP = calculateProgramRevenue("CSRP", "locationSelect1", "eventHoursSelect1", "customBox1", "commitmentInput", 5);
        totalRevenue += resultsCSRP.revenue;
        totalCO2Emissions += resultsCSRP.co2Emissions;
            if (resultsCSRP.revenue !== 0) {
                messages.push({
                programName: "ConEd CSRP",
                capacityRevenue: resultsCSRP.capacityRevenue,
                energyRevenue: resultsCSRP.energyRevenue,
                rate: resultsCSRP.rate,
                energyRate: 1
                });
            }
        
        // Calculate for DLRP
        resultsDLRP = calculateProgramRevenue("DLRP", "locationSelect2", "eventHoursSelect2", "customBox2", "commitmentInput2", 5);
        totalRevenue += resultsDLRP.revenue;
        totalCO2Emissions += resultsDLRP.co2Emissions;
            if (resultsDLRP.revenue !== 0) {
                messages.push({
                programName: "ConEd DLRP",
                capacityRevenue: resultsDLRP.capacityRevenue,
                energyRevenue: resultsDLRP.energyRevenue,
                rate: resultsDLRP.rate,
                energyRate: 1
                });
            }
        

        // Calculate for SCR Summer
        resultsSCRS = calculateProgramRevenue("SCRS", "locationSelect3", "eventHoursSelect3", "customBox3", "commitmentInput3", 6);
        totalRevenue += resultsSCRS.revenue;
        totalCO2Emissions += resultsSCRS.co2Emissions;
            if (resultsSCRS.revenue !== 0) {
                messages.push({
                programName: "NYISO SCR (Summer)",
                capacityRevenue: resultsSCRS.capacityRevenue,
                rate: resultsSCRS.rate
                // energyRevenue: resultsSCRS.energyRevenue
                });
            }
        }

        if (document.getElementById("winter").checked || document.getElementById("both").checked) {
        // Calculate for SCR Winter
        resultsSCRW = calculateProgramRevenue("SCRW", "locationSelect4", "eventHoursSelect4", "customBox4", "commitmentInput4", 6);
        totalRevenue += resultsSCRW.revenue;
        totalCO2Emissions += resultsSCRW.co2Emissions;
            if (resultsSCRW.revenue !== 0) {
                messages.push({
                programName: "NYISO SCR (Winter)",
                capacityRevenue: resultsSCRW.capacityRevenue,
                rate: resultsSCRW.rate
                // energyRevenue: resultsSCRW.energyRevenue
                });
            }
        }


        // Display the results
        displayProgramResults(messages);

        // Update total results 
        var formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        });

        document.getElementById("totalRevenueDisplay").textContent = formatter.format(totalRevenue);
        document.getElementById("totalCO2Display").textContent = formatter.format(totalCO2Emissions) + " MTCO2e";
        document.getElementById("totalResultContainer").style.display = "block";
    };

    document.getElementById("total-button").addEventListener("click",calculateTotalRevenue);



    // // Helper function to format the results into a string
    function formatResults(results) {
        var formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
        });

        var capacityRevenue = results.capacityRevenue !== 0 ? formatter.format(results.capacityRevenue) : "N/A";
        var energyRevenue = results.energyRevenue !== 0 ? formatter.format(results.energyRevenue) : "N/A";

        var resultString = `Capacity Revenue: $${capacityRevenue}, Energy Revenue: $${energyRevenue}`;

        return resultString;
    }
    // Helper function to calculate revenue and CO2 emissions for a given program
    function calculateProgramRevenue(program, locationSelectId, eventHoursSelectId, customBoxId, commitmentInputId, months) {
        const ENERGY_RATE = 1; // $/kw
        const CO2_EMISSION_FACTOR = 100 * 0.00030713; // CO2 emission factor

        var locationRate = getLocationRate(locationSelectId, program);
        var eventHours = getEventHours(eventHoursSelectId, customBoxId, program);
        var commitment = parseFloat(document.getElementById(commitmentInputId).value) || 0;

        var capacityRevenue = commitment * months * locationRate;
        var energyRevenue = commitment * eventHours * ENERGY_RATE;
        var co2Emission = commitment * eventHours * CO2_EMISSION_FACTOR;

        if (program === "SCRS" || program === "SCRW") {
            capacityRevenue *= 0.9; 
            energyRevenue = 0; 
        }

        return {
            capacityRevenue: capacityRevenue,
            energyRevenue: energyRevenue,
            co2Emissions: co2Emission,
            revenue: capacityRevenue + energyRevenue,
            rate: locationRate, 
        };
    }

    // Adjust getLocationRate to use the correct rates based on the program
    function getLocationRate(selectId, program) {
        var selectedOption = document.getElementById(selectId).value;
        var rate = 0;
        console.log('selectId:', selectId); 
        console.log('selectedOption:', selectedOption); 
        console.log('program:', program);

        if (selectedOption === "location1") {
            if (program === "CSRP") {
                rate = 18; // $18/kW for CSRP Location1
            } else if (program === "DLRP") {
                rate = 18; // $18/kW for DLRP Location1
            } else if (program === "SCRS") {
                rate = 19; // $19/kW for SCR Summer Location1
            }
            else if (program === "SCRW") {
                rate = 10; // $19/kW for SCR Summer Location1
            }
        } else if (selectedOption === "location2") {
            if (program === "CSRP") {
                rate = 6; // $/kW for CSRP Location2
            } else if (program === "DLRP") {
                rate = 25; // $25/kW for DLRP Location2
            } else if (program === "SCRS") {
                // Custom rate for SCR Summer Location2, handled below
            }
        } else if (selectedOption === "custom") {
            // Use the corresponding custom box input for custom rates
            rate = parseFloat(document.getElementById("customBox" + selectId.charAt(selectId.length - 1)).value) || 0;
        }
        console.log('rate:', rate);
        return rate;
    }


    // Helper function to get the event hours based on the selected option or custom input
    function getEventHours(selectId, inputId) {
        var selectedOption = document.getElementById(selectId).value;
        var hours; // Removed default value
        if (selectedOption === "custom") {
            hours = parseFloat(document.getElementById(inputId).value) || 0;
        } else if (selectedOption === "default") {
            if (selectId === "eventHoursSelect2") {
                hours = 2; // Set hours to 2 for default in eventHoursSelect2
            } else {
                hours = 1; // Set hours to 1 for default in other select boxes
            }
        } else {
            hours = 1; // Set hours to 1 if no option is selected
        }
        console.log('Hours:', hours); // Add this line
        return hours;
    }
    

    

    // Form 2
    // Define displayRates function
        // window.displayRates=function () {
        //     var csrpRate = getLocationRate('selectIdForCSRP', 'CSRP');
        //     var dlrpRate = getLocationRate('selectIdForDLRP', 'DLRP');
        //     var scrsRate = getLocationRate('selectIdForSCRS', 'SCRS');
        //     var scrwRate = getLocationRate('selectIdForSCRW', 'SCRW');

        //     var rateDisplayDiv = document.getElementById('rateDisplayDiv');
        //     rateDisplayDiv.innerHTML = `
        //         <p>CSRP: Capacity Rate: $${csrpRate}/kW, Energy Rate: $${csrpRate}/kW</p>
        //         <p>DLRP: Capacity Rate: $${dlrpRate}/kW, Energy Rate: $${dlrpRate}/kW</p>
        //         <p>SCRS: Capacity Rate: $${scrsRate}/kW</p>
        //         <p>SCRW: Capacity Rate: $${scrwRate}/kW</p>
        //     `;
        // };
    window.calculate = function() {
        // Define program details
        let programDetails = {
            "ConEd CSRP": { months: 5, rate: 18 },
            "ConEd DLRP": { months: 5, rate: 18 },
            "NYISO SCR Summer": { months: 6, rate: 19 },
            "NYISO SCR Winter": { months: 6, rate: 10 }
        };

        // Get commitments
        let commitments = {
            "ConEd CSRP": document.getElementById("input1").value,
            "ConEd DLRP": document.getElementById("input1").value,
            "NYISO SCR Summer": document.getElementById("input1").value,
            "NYISO SCR Winter": document.getElementById("input1").value
        };

        // Clear previous results from the correct container
        let resultsContainer = document.getElementById("resultContainerF1");
        resultsContainer.innerHTML = '';

        let totalRevenue = 0;

        // Iterate over commitments to create and append cards
        for (let program in commitments) {
            let commitment = commitments[program];
            if (commitment !== "") {
                commitment = parseFloat(commitment);
                let { months, rate } = programDetails[program];
                let revenue = commitment * months * rate;
        
                if (program === "NYISO SCR Summer" || program === "NYISO SCR Winter") {
                    revenue *= 0.9;
                }

                // Add revenue to total
                totalRevenue += revenue;

                // Create card element
                let card = document.createElement("div");
                card.className = "col-md-4 col-lg-6 mb-4 mx-auto small";//card col-md-6 col-lg-4 mb-4
                card.innerHTML = `
                <div class="card h-100">    
                    <div class="card-body">
                        <h5 class="text-center">${program}</h5>
                        <p class="card-text fw-bold fs-5" style="text-align: center;">
                            Maximum Revenue: $${revenue.toLocaleString()}<br>
                            Capability Period: ${months} Months<br>
                            Capacity Rate: $${rate}/kw/month
                        </p>
                    </div>
                </div>
                `;

                // Append the card to the results container
                resultsContainer.appendChild(card);
            }
        }

        // Display total revenue
            let totalRevenueDisplay = document.getElementById("totalRevenueDisplayF1");
            console.log('totalRevenueDisplay:', totalRevenueDisplay);
            totalRevenueDisplay.textContent = totalRevenue.toLocaleString();

            let totalResultContainer = document.getElementById("totalResultContainerF1");
            console.log('totalResultContainer:', totalResultContainer);
            totalResultContainer.style.display = "block";
        
            // displayRates();
        
        
    };

    document.querySelector('.btn.btn-primary').addEventListener('click', calculate);


});