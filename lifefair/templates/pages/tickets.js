filterSelection("all")

function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    removeClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) addClass(x[i], "show");
  }
}

function addClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function removeClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function addToCart() {
  console.log('hello')
}

function loadBlocks(anlass) {
	frappe.call({
    method:"frappe.client.get_list",
    args:{
 	doctype:"Block",
 	filters: [
 	    ["meeting", "=", anlass]
 	],
        fields: ["official_title, short_name, neues_datum, time, interest_1, interest_2, interest_3"],
    },
    'callback': function (response) {
            var blocks = response.message;
            console.log(blocks);
            
            var textContainer = document.querySelector(".display");
			textContainer.innerHTML = "";
			blocks.forEach(function (block) {
				addToCart()
				var card = document.createElement('div');
				card.classList.add('filterDiv');
				var cardText = block.official_title.split(":");
				card.innerHTML += `<p class='blockTitle'>  ${cardText[0]} </p> <p class='blockTime'>  ${block.short_name} &nbsp;&nbsp;&nbsp; ${block.time} </p>`;
				if(cardText.length > 1) {
				   card.innerHTML += `<p class='blockText'> ${cardText[1]} </p>`;
				}	
				card.innerHTML += `<div class='buttonsContainer'> <div class='cart' >Cart</div> <div class='video'>Video</div> <a href="https://sges.ch/about" target="_blank" class='info'>Info</a> </div>`;
				textContainer.appendChild(card); 
				
				if (block.neues_datum) {
					  console.log()
				  }
				if (block.time) {
					  var timeRange = block.time.split("-");;
					  console.log(timeRange)
				  }
				
				for (const [key, value] of Object.entries(block)) {
				  switch (value) {
				    case 'Gesundheit':
					  card.classList.add('gesundheit');
					  break;
					case 'Nahrung':
					  card.classList.add('nahrung');
					  break;
					case 'Bauen':
					  card.classList.add('bauen');
					  break;
					case 'Mobilität':
					  card.classList.add('mobilität');
					  break;
					case 'Investieren und Finanzieren':
					  card.classList.add('investieren');
					  break;
					case 'Kommunikation':
					  card.classList.add('kommunikation');
					  break;
					case 'Smart Cities':
					  card.classList.add('smart');
					  break;
					case 'Energie':
					  card.classList.add('energie');
					  break;
					case 'Klima':
					  card.classList.add('klima');
					  break;
					case 'Ressourcen':
					  card.classList.add('ressourcen');
					  break;
					case 'Kreislaufwirtschaft':
					  card.classList.add('kreislaufwirtschaft');
					  break;
					case 'Kultur':
					  card.classList.add('kultur');
					  break;
					case 'Aviation':
					  card.classList.add('aviation');
					  break;
					case 'Entrepreneurship':
					  card.classList.add('entrepreneurship');
					  break;
					case '08:15 - 12:15 Uhr':
					  card.classList.add('vormittag');
					  break;
					case '14:00 - 16:45 Uhr':
					  card.classList.add('nachmittag');
					  break;
					case '20.00 - 22.00 Uhr':
					  card.classList.add('abend');
					  break;
				    default:
					  console.log("1", block.interest_1, "2", block.interest_2, "3", block.interest_3);
					  break;
				  }
				}		
			});
			
			function addToCart(blocks) {
				console.log('hello')
			}			      
	}});
}

document.addEventListener("DOMContentLoaded", function(event) {
    // add change triggers here
    
    // process command line arguments
    get_arguments();
});

function get_arguments() {
    var arguments = window.location.toString().split("?");
    console.log("in the arguments", arguments);
    if (!arguments[arguments.length - 1].startsWith("http")) {
		console.log("in the if statement");
        var args_raw = arguments[arguments.length - 1].split("&");
        var args = {};
        args_raw.forEach(function (arg) {
            var kv = arg.split("=");
            if (kv.length > 1) {
                args[kv[0]] = decodeURI(kv[1]);
            }
        });
        console.log("in the args", args);
        if (args['anlass']) {
            // fetch payment status
            loadBlocks(args['anlass']);
        }
    } 
}
