var globalBlocks = [];
var initialState = {
	userType : "",
	userFirma: "",
	cart : [] //|| JSON.parse(localStorage.getItem("CART")); 
};
var cartbButton = document.getElementById("btnCart");

filterSelection("all");
updateCart();

function userSelection(c) {
  initialState.userType = c;
  console.log("the user", initialState.userType);
}

function firmaSelection(c) {
  initialState.userFirma = c;
  console.log("the firma", initialState.userFirma );
}

function filterSelection(c) {
  console.log("the filter", c)
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    removeClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) addClass(x[i], "show");
  }
}

function addClass(element, name) {
	console.log("in the add", element, name)
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  console.log("in the add arr1", arr1)
  arr2 = name.split(" ");
    console.log("in the add arr2", arr2)
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function removeClass(element, name) {
	console.log("in the remove", element, name)
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  console.log("in the remove arr1", arr1)
  arr2 = name.split(" ");
  console.log("in the remove arr2", arr2)
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainerOne = document.getElementById("filterBtnContainerOne").querySelectorAll("button")
btnContainerOne.forEach((element) => {
	element.addEventListener("click", function(){
		btnContainerOne.forEach(btn => btn.classList.remove("active"))
		this.classList.add("active");
	})
})

var btnContainerTwo = document.getElementById("filterBtnContainerTwo").querySelectorAll("button")
btnContainerTwo.forEach((element) => {
	element.addEventListener("click", function(){
		btnContainerTwo.forEach(btn => btn.classList.remove("active"))
		this.classList.add("active");
	})
})

var btnContainerThree = document.getElementById("filterBtnContainerThree").querySelectorAll("button")
btnContainerThree.forEach((element) => {
	element.addEventListener("click", function(){
		btnContainerThree.forEach(btn => btn.classList.remove("active"))
		this.classList.add("active");
	})
})

var btnContainerFour = document.getElementById("filterBtnContainerFour").querySelectorAll("button")
btnContainerFour.forEach((element) => {
	element.addEventListener("click", function(){
		btnContainerFour.forEach(btn => btn.classList.remove("active"))
		this.classList.add("active");
	})
})


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
	 if (initialState.cart.some((item) => item.short_name == globalBlocks[i].short_name)) {
		changeNoOfUnits("plus", globalBlocks[i].short_name);
	 } else {
		initialState.cart.push({
			 ...globalBlocks[i], 
			 numberOfUnits: 1
		});
	 }	
	updateCart();
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
	if ( initialState.cart.length > 0) {
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
	} else {
		cartElement.innerHTML = "<p class='cartLeer'>DEIN WARENKORB IST MOMENTAN LEER</p>";
	}
	
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

function start() {
    document.getElementById("step0").style.display = "block";
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "none";
    // prepare topic
    cartbButton.innerHTML = `<p onclick="checkOut()" class="cartBtnText">ZUM WARENKORB</p>`
    filterSelection("all");

}

function checkOut() {
	document.getElementById("step0").style.display = "none";
    document.getElementById("step1").style.display = "block"
    
    cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT ZAHLEN</p>`
}

function checkDataAndPay() {
	console.log("in the pay func");
	document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function loadBlocks(anlass) {
	frappe.call({
    method:"frappe.client.get_list",
    args:{
 	doctype:"Block",
 	filters: [
 	    ["meeting", "=", anlass]
 	],
        fields: ["official_title, sub_title, short_name, neues_datum, time, interest_1, interest_2, interest_3"],
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
				
				card.innerHTML += `<div class='blockContainer'> <p class='blockTime'>  ${block.short_name} &nbsp;&nbsp;&nbsp; ${block.time} </p> <p class='blockTitle'>  ${block.official_title} </p> <p class='blockText'>  ${block.sub_title} </p><div>`;
				card.innerHTML += `<div class='buttonsContainer'> <a href="https://sges.ch/about" target="_blank" class='info'>Info</a> <div class='cart' onclick="addToCart(${i})">Cart</div> </div>`;
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
        if (args['anlass']) {
            // fetch payment status
            loadBlocks(args['anlass']);
        }
    } 
}
