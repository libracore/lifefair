var globalBlocks = [];
var initialState = {
	userAge: null,
	cart : [] //|| JSON.parse(localStorage.getItem("CART")) 
};
openModal();
filterSelection("all");
updateCart();

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
var btnContainer = document.getElementById("filterBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function checkTime(time) {
	//7 - 13 Vormitag; 13:01 - 18 Nachmittag; 18:01 - 23 Abend;
	var timeSplitFrom = time[0].split(":");
	var timeSplitTo = time[1].split(":");
	var result = [];
	
	result.push(timeOfDay(timeSplitFrom));
	result.push(timeOfDay(timeSplitTo));
	if (result[0] == result[1]) {
		result.pop();
		return result;
		} else {
			return result;
			}
}

function timeOfDay(timeRange) {
	//return 1 : vormittag
	//return 2 : nachtmittag
	//return 3 : abend
	if (parseInt(timeRange[0]) <= 13) {
		if (parseInt(timeRange[0]) == 13 && parseInt(timeRange[1]) > 0) {
			return 2
		} else {
			return 1		
		}	
	} 	
	else if ( parseInt(timeRange[0]) >= 18) {
		if (parseInt(timeRange[0]) == 18 && parseInt(timeRange[1]) == 0) {
			return 2	
		} else {
			return 3				
		}
	} else {
		return 2
	}	
}

function addToCart(i) {
	 if (initialState.userAge == null) {
		 openModal();
	} else {
		if (initialState.cart.some((item) => item.short_name == globalBlocks[i].short_name)) {
		changeNoOfUnits("plus", globalBlocks[i].short_name);
		} else {
			initialState.cart.push({
				 ...globalBlocks[i], 
				 numberOfUnits: 1
			});
		}	
	}
	 
	updateCart();
}

function openModal() {
	var backdrop = document.createElement('div');
	backdrop.classList.add('backdrop');
	var divContainer = document.querySelector(".container");
	document.insertBefore(backdrop, divContainer);
	backdrop.addEventListener('click', closeModal)
	
	var modal = document.createElement('div');
	modal.addEventListener('click', closeModal)
	modal.innerHTML += `
			<div class="modal"> 
				<h1 class="modalTitle"> Please select which type of user are you</h1>
				<div class="modalSelection">
					<div>1</div>
					<div>2</div>
					<div>3</div>
				</div>
			</div>
			`;
}

function closeModal() {
	if (backdrop && modal) {
		backdrop.remove();
		modal.remove();
	}
}

function updateCart() {
	updateItems();
	updateTotal();
	
	//localStorage.setItem("CART", JSON.stringify(initialState.cart));
}

function updateTotal() {
	var cartTotal = document.querySelector(".cartTotal");
	var totalPrice = 0;
	
	initialState.cart.forEach((item, i) => {
		totalPrice += 20.00 * item.numberOfUnits;
		cartTotal.innerHTML = `<p>TOTAL</p> <p>${totalPrice.toFixed(2)}</p>`;	
	});
		
}

function updateItems() {
	var cartElement = document.querySelector(".cartElement");
	cartElement.innerHTML = ""; //Clearing the cart to avoid duplication
	initialState.cart.forEach((item, i) => {
		var cardText = item.official_title.split(":");
		cartElement.innerHTML += `
			<div class="cartItems"> 
				<div class="cartInfo"> 
					<p class="cartItem"> ${item.neues_datum} </p>
					<p class="cartItem"> ${item.short_name} &nbsp; ${cardText[0]} </p>
					<p class="cartItem"> ${item.time} </p>
				</div>
				<div class="cartAmount">
					<div class="itemPrice" >20.00</div>
					<div class="cartUnits">
						<div class="btnMinus" onclick="changeNoOfUnits('minus', ${i})">-</div>
						<div class="ItemNum">${item.numberOfUnits}</div>
						<div class="btnPlus" onclick="changeNoOfUnits('plus', ${i})">+</div>
					</div>
				</div>
				<div class="cartCancel" onclick="removeCartItem(${i})"> X </div>
			</div>
			`;
		});
}

function changeNoOfUnits(action, i) {
		console.log(action, i);
		initialState.cart = initialState.cart.map((item, x) => {
			var numberOfUnits = item.numberOfUnits;
			if ( i == x || i == item.short_name ) {
				if (action == "minus" && numberOfUnits > 1) {
					numberOfUnits--;
				} else if (action == "plus") {
					numberOfUnits++;
				}
			}
			return {
				...item,
				numberOfUnits,
				}
		});
		
		updateCart();
}

function removeCartItem(i) {
	console.log('removing');
	console.log(globalBlocks[i].short_name);
	initialState.cart = initialState.cart.filter((item)=> item.short_name != globalBlocks[i].short_name);
	updateCart();
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
			blocks.forEach(function (block, i) {
				globalBlocks.push(block);
				var card = document.createElement('div');
				card.classList.add('filterDiv');
				var cardText = block.official_title.split(":");
				card.innerHTML += `<p class='blockTitle'>  ${cardText[0]} </p> <p class='blockTime'>  ${block.short_name} &nbsp;&nbsp;&nbsp; ${block.time} </p>`;
				if(cardText.length > 1) {
				   card.innerHTML += `<p class='blockText'> ${cardText[1]} </p>`;
				}	
				card.innerHTML += `<div class='buttonsContainer'> <div class='cart' onclick="addToCart(${i})">Cart</div> <div class='video'>Video</div> <a href="https://sges.ch/about" target="_blank" class='info'>Info</a> </div>`;
				textContainer.appendChild(card); 
				
				
				if (block.time) {
					var twoTimeRange = block.time.split("und");
					
					if (twoTimeRange.length > 1) {
						for (var i = 0; i < twoTimeRange.length; i++ ) {
							
							var OnetimeRange = twoTimeRange[i].split("-");
							var timeFilter = checkTime(OnetimeRange);
							  for (var j = 0; j < timeFilter.length; j++ ) {
								  if (timeFilter[j] == 1) {
									  card.classList.add('vormittag');
									  } else if ( timeFilter[j] == 2){
										  card.classList.add('nachmittag');
										  } else {
											  card.classList.add('abend');
											  }
								  }
							}
						} else {
							
							var OnetimeRange = block.time.split("-");
							var timeFilter = checkTime(OnetimeRange);
							  for (var i = 0; i < timeFilter.length; i++ ) {
								  if (timeFilter[i] == 1) {
									  card.classList.add('vormittag');
									  } else if ( timeFilter[i] == 2){
										  card.classList.add('nachmittag');
										  } else {
											  card.classList.add('abend');
											  }
								  }
							
							}
					  
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
				    default:
					  
					  break;
				  }
				}		
			});					      
	}});
}

document.addEventListener("DOMContentLoaded", function(event) {
    // add change triggers here
    
    // process command line arguments
    get_arguments();
});

function get_arguments() {
    var arguments = window.location.toString().split("?");
    if (!arguments[arguments.length - 1].startsWith("http")) {
        var args_raw = arguments[arguments.length - 1].split("&");
        var args = {};
        args_raw.forEach(function (arg) {
            var kv = arg.split("=");
            if (kv.length > 1) {
                args[kv[0]] = decodeURI(kv[1]);
            }
        });
        console.log(args);
        if (args['anlass']) {
            // fetch payment status
            loadBlocks(args['anlass']);
        }
    } 
}
