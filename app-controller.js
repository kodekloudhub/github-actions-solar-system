console.log('We are inside client.js');

/* on page load  */
window.onload = function() {
    const planet_id = document.getElementById("planetID").value
    console.log("onLoad - Request Planet ID - " + planet_id)

    fetch("/os", {
            method: "GET"
        })
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Request failed');
        }).catch(function(error) {
            console.log(error);
        })
        .then(function(data) {
            document.getElementById('hostname').innerHTML = `Pod - ${data.os} `
          //  document.getElementById('environment').innerHTML = ` Env - ${data.env}  `
        });
};



const btn = document.getElementById('submit');
if (btn) {
    btn.addEventListener('click', func);
}

function func() {
    const planet_id = document.getElementById("planetID").value
    console.log("onClick Submit - Request Planet ID - " + planet_id)

    fetch("/planet", {
            method: "POST",
            body: JSON.stringify({
                id: document.getElementById("planetID").value
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(function(res2) {
            console.log("Response status:", res2.status);
            if (res2.ok) {
                return res2.json();
            }
            
            // Special handling for 503 status (database connection error)
            if (res2.status === 503) {
                throw new Error("Database connection error. Please try again later.");
            } else if (res2.status === 404) {
                // Directly handle 404 (not found) without trying to parse JSON
                throw new Error('Ooops, We have 8 Planets and a Sun.\nSelect a number from 0 - 8');
            }
            
            // For other non-OK responses, try to parse the error message
            return res2.json().then(errorData => {
                if (errorData && errorData.error) {
                    throw new Error(errorData.error);
                } else {
                    throw new Error('Request failed');
                }
            }).catch(() => {
                // If we can't parse the JSON, use a default error message based on status code
                if (res2.status === 404) {
                    throw new Error('Ooops, We have 8 Planets and a Sun.\nSelect a number from 0 - 8');
                } else {
                    throw new Error('Request failed');
                }
            });
        }).catch(function(error) {
            // Display the specific error message
            alert(error.message);
            console.log("Error:", error.message);
        })
        .then(function(data) {
            if (data) {
                document.getElementById('planetName').innerHTML = ` ${data.name} `

                const element = document.getElementById("planetImage");
                const image = ` ${data.image} `
                element.style.backgroundImage  = "url("+image+")"

                const planet_description = ` ${data.description} `
                document.getElementById('planetDescription').innerHTML = planet_description.replace(/(.{80})/g, "$1<br>");
            }
        });
}