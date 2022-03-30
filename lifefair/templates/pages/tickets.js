var blocks;
var itemVal;
var inTheChekout = false;
var initialState = {
	userTypeValue : 0,
	cart : [] //|| JSON.parse(localStorage.getItem("CART")); 
};

var cartElement = document.querySelector(".cartElement");
var cartTotal = document.querySelector(".cartTotal");
var cartbButton = document.getElementById("btnCart");
var selectedFilterDiv = document.getElementById("selectedFilters");
var btnContainerThree = document.getElementById("filterBtnContainerThree").querySelectorAll("button");

updateCart();

//filterSelection("all");


function userSelection(c) {
	  switch (c) {
		case 'selbstzahlende':
			initialState.userTypeValue = 1.50;
			break;
		case 'privatperson':
			initialState.userTypeValue = 2.00;
			break;
		case 'FIRMA 1 - 9 MA':	
			initialState.userTypeValue = 5.00;
			break;
		case 'FIRMA 10 - 99 MA':
			initialState.userTypeValue = 6.00;
			break;
		case 'FIRMA 100 - 199 MA':
			initialState.userTypeValue = 7.70;
			break;
		case 'FIRMA 199+ MA':
			initialState.userTypeValue = 10.00;
			break;
		default:
			break;
	}
	
	document.getElementById("ichBin").classList.remove("shake");
	document.getElementById("filterBtnContainerTwo").classList.remove("grey");
	document.getElementById("filterBtnContainerThree").classList.remove("grey");
	document.querySelector(".display").classList.remove("grey");
	document.getElementById("filterBtnContainerTwo").querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	document.getElementById("filterBtnContainerThree").querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	console.log("the user", initialState.userTypeValue);
}

function filterSelection(c) {
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
	} else {
	  var x, i;
	  x = document.getElementsByClassName("filterDiv");
	  if (c == "all") c = "";
	  for (i = 0; i < x.length; i++) {
		removeClass(x[i], "show");
		if (x[i].className.indexOf(c) > -1) addClass(x[i], "show");
	  }
	  titleFilter(c)
	}
	
}


function titleFilter(c) {
	
	if (c) {
	
	for (var i = 0; i < blocks.length; i++ ) {
		
		if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
			if (document.getElementById(`vormittag_${blocks[i].neues_datum}`).querySelector(`.${c}`) == null) {
				document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "none";					
			} else {
				document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "block";
			}
		}
		if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
			if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`).querySelector(`.${c}`) == null) {
				document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "none";
					
			} else {
				document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "block";
			}
		} 
		if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
			if (document.getElementById(`abend_${blocks[i].neues_datum}`).querySelector(`.${c}`) == null) {
				document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "none";
					
			} else {
				document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "block";
			}
		} 	
	};
 }
}



function filterTimeSlot(c) {
	
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
	} else {
	
		if (selectedFilterDiv.children.length == 3) {
			document.getElementById("themaAll").classList.add("active");
			btnContainerThree.forEach(btn => btn.classList.remove("active"));
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		}
		
		
		for (var i = 0; i < blocks.length; i++ ) {
		
			switch (c) {
				case 'vormittag':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "block";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "none";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "none";	
					}
					break;
				case 'nachmittag':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "none";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "block";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "none";	
					}
					break;
				case 'abend':	
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "none";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "none";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "block";	
					}
					break;
				case 'all':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "block";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "block";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
						document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "block";	
					}
					break;
			}	 		 	
		}
		filterSelection("all");
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

// Add active class to the current button in the respective container and highlight it the top
var btnContainerOne = document.getElementById("filterBtnContainerOne").querySelectorAll("button");
btnContainerOne.forEach((element) => {
	element.addEventListener("click", function(){
		
		btnContainerOne.forEach(btn => btn.classList.remove("active"));
		
		var orange = document.querySelector(".orangeFilter");
		var answer = selectedFilterDiv.contains(orange);
		var orangeFilterBlock;
		if (answer == true) {
			var userTypeChildLi = selectedFilterDiv.getElementsByTagName('li')[0];
			orangeFilterBlock = document.createElement('li');
			orangeFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 1)">X</div>`;
			orangeFilterBlock.classList.add('orangeFilter');
			orangeFilterBlock.classList.add('filter');
			selectedFilterDiv.replaceChild(orangeFilterBlock, userTypeChildLi);
			
		} else {
			orangeFilterBlock = document.createElement('li');
			orangeFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 1)">X</div>`;
			orangeFilterBlock.classList.add('orangeFilter');
			orangeFilterBlock.classList.add('filter');
			selectedFilterDiv.insertBefore(orangeFilterBlock, selectedFilterDiv.firstChild);	
		}
		
		this.classList.add("active");	
		
	}); 
});

var btnContainerTwo = document.getElementById("filterBtnContainerTwo").querySelectorAll("button");
btnContainerTwo.forEach((element) => {
	element.addEventListener("click", function(){
		
		if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
		} else {
			document.getElementById("ichBin").classList.remove("shake");
			btnContainerTwo.forEach(btn => btn.classList.remove("active"));
			
			
			var blueDatum = document.querySelector(".datumBlueFilter");
			var answer = selectedFilterDiv.contains(blueDatum); 
			var blueFilterBlock;
			if (answer == true) {
				var datumChildLi = selectedFilterDiv.getElementsByTagName('li')[1];
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 2)">X</div>`;
				blueFilterBlock.classList.add('datumBlueFilter');
				blueFilterBlock.classList.add('filter');
				selectedFilterDiv.replaceChild(blueFilterBlock, datumChildLi);	
			} else {
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 2)">X</div>`;
				blueFilterBlock.classList.add('datumBlueFilter');
				blueFilterBlock.classList.add('filter');
				if (selectedFilterDiv.children.length == 2) {
					//console.log("in the first if", selectedFilterDiv.children.length)
					selectedFilterDiv.insertBefore(blueFilterBlock, selectedFilterDiv.lastElementChild);
				} else {
					//console.log("in the second if", selectedFilterDiv.children.length)
					selectedFilterDiv.appendChild(blueFilterBlock);
				}
				
			}
			
			this.classList.add("active");
		
		}
	});
});


btnContainerThree.forEach((element) => {
	element.addEventListener("click", function(){
		if (initialState.userTypeValue == 0) {
			document.getElementById("ichBin").classList.add("shake");
		} else {
			document.getElementById("ichBin").classList.remove("shake");
			btnContainerThree.forEach(btn => btn.classList.remove("active"));
			
			var blueThema = document.querySelector(".themaBlueFilter");
			var answer = selectedFilterDiv.contains(blueThema);
			var blueFilterBlock;
			if (answer == true) {
				console.log("in the blueThema true")
				var themaChildLi = selectedFilterDiv.getElementsByTagName('li')[2];
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 3)">X</div>`;
				blueFilterBlock.classList.add('themaBlueFilter');
				blueFilterBlock.classList.add('filter');
				selectedFilterDiv.replaceChild(blueFilterBlock, themaChildLi);		
			} else {
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 3)">X</div>`;
				blueFilterBlock.classList.add('themaBlueFilter');
				blueFilterBlock.classList.add('filter');
				selectedFilterDiv.appendChild(blueFilterBlock);
			}
			
			this.classList.add("active");
		}	
	});
});

function removeFilter(li, num) {
	li.parentNode.parentNode.removeChild(li.parentNode);
	
	if (num == 1 ){
		btnContainerOne.forEach(btn => btn.classList.remove("active"));
		initialState.userTypeValue = 0;
		document.getElementById("filterBtnContainerTwo").classList.add("grey");
		document.getElementById("filterBtnContainerThree").classList.add("grey");
		document.querySelector(".display").classList.add("grey");
	} else if ( num == 2) {
		btnContainerTwo.forEach(btn => btn.classList.remove("active"));
	} else if ( num == 3) {
		btnContainerThree.forEach(btn => btn.classList.remove("active"));
	}
	
	if (selectedFilterDiv.children.length == 1) {
		filterTimeSlot("all")
	}
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
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
	} else {
		if (initialState.cart.some((item) => item.short_name == blocks[i].short_name)) {
		console.log("already there", blocks[i].short_name)
		 } else {
			initialState.cart.push({
				 ...blocks[i], 
			});
		 }	
		updateCart();
	}
	 
}

function updateCart() {
	updateItems();
	updateTotal();

	//localStorage.setItem("CART", JSON.stringify(initialState.cart));
}

function updateTotal() {
	var totalPrice = 0;
	if ( initialState.cart.length > 0) {
		initialState.cart.forEach((item, i) => {
			totalPrice += 20 * initialState.userTypeValue;
			cartTotal.innerHTML = `<p>TOTAL</p> <p>${totalPrice.toFixed(2)}</p>`;	
		});
	} else { cartTotal.innerHTML = ""}
		
}

function updateItems() {
	if ( initialState.cart.length > 0) {
		cartElement.innerHTML = ""; //Clearing the cart to avoid duplication
		initialState.cart.forEach((item, i) => {
			var cardText = item.official_title.split(":");
			itemVal = 20.00 * initialState.userTypeValue;
			cartElement.innerHTML += `
				<div class="cartItems"> 
					<div class="cartInfo"> 
						<p class="cartItem"> ${item.neues_datum} </p>
						<p class="cartItem"> ${item.short_name} &nbsp; ${cardText[0]} </p>
						<p class="cartItem"> ${item.time} </p>
					</div>
					<div class="cartAmount">
						<div class="itemPrice" >${itemVal.toFixed(2)}</div>
					</div>
					<div class="cartCancel" onclick="removeCartItem(${i})"> X </div>
				</div>
				`;
			});
	} else {
		cartElement.innerHTML = "<p class='cartLeer'>DEIN WARENKORB IST MOMENTAN LEER</p>";
	}
	
}

/*function changeNoOfUnits(action, i) {
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
} */

function removeCartItem(i) {
	//console.log('removing', i, initialState.cart[i]);
	if (inTheChekout == true) {
		if (initialState.cart.length > 1) {
			initialState.cart = initialState.cart.filter((item)=> item.short_name != initialState.cart[i].short_name);
			updateCart();
		}
	} else {
		initialState.cart = initialState.cart.filter((item)=> item.short_name != initialState.cart[i].short_name);
		updateCart();
	}
}

function start() {
	inTheChekout = false;
	document.getElementById("warenkorb").style.display = "block";
    document.getElementById("step0").style.display = "block";
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "none";
    // prepare topic
    cartbButton.innerHTML = `<p onclick="checkOut()" class="cartBtnText">ZUM WARENKORB</p>`

}

function checkOut() {
	
	if (initialState.cart.length == 0) {
		var shaketext = document.querySelector(".cartLeer")
			shaketext.classList.add("shake");
		} else {
			inTheChekout = true;
			document.getElementById("gleiche").checked = true;
			document.getElementById("step0").style.display = "none";
			document.getElementById("step1").style.display = "block"
			cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT ZAHLEN</p>`
		}
}

//Watching over the checkbox in the checkout 
var gleicheAdresse = document.getElementById("gleiche");
gleicheAdresse.addEventListener('change', function(e){
	if (!gleicheAdresse.checked) {
		console.log("Not gleiche check");
	}
});

var kreditkarte = document.getElementById("kreditkarte");
kreditkarte.addEventListener('change', function(e){
	if (kreditkarte.checked) {
		console.log("kreditkarte check");
	}
});

var rechnung = document.getElementById("rechnung");
rechnung.addEventListener('change', function(e){
	if (rechnung.checked) {
		console.log("rechnung check");
	}
});

//Cheking the Values after proceeding to pay
function checkDataAndPay() {
	console.log("in the pay func");
	
	var lastname = document.getElementById("inputSurname").value;
	var firstname = document.getElementById("inputFirstname").value;
	var firma = document.getElementById("inputFirma").value;
	var funktion = document.getElementById("inputFunktion").value;
	var phone = document.getElementById("inputPhone").value;
    var email = document.getElementById("inputEmail").value;  
    var adresse = document.getElementById("inputAdresse").value;
    var plzOrt = document.getElementById("inputOrt").value;
    
    console.log(lastname, firstname, firma, funktion, phone, email, adresse, plzOrt);
    
    if (!lastname) {
        document.getElementById("inputSurname").style.border = "1px solid red;"
        document.getElementById("inputSurname").focus();
    } else if (!firstname) {
        document.getElementById("inputFirstname").style.border = "1px solid red;"
        document.getElementById("inputFirstname").focus();
    } else if (!firma) {
        document.getElementById("inputFirma").style.border = "1px solid red;"
        document.getElementById("inputFirma").focus();
    } else if (!funktion) {
        document.getElementById("inputFunktion").style.border = "1px solid red;"
        document.getElementById("inputFunktion").focus();
    } else if (!phone) {
        document.getElementById("inputPhone").style.border = "1px solid red;"
        document.getElementById("inputPhone").focus();
    } else if (!email) {
        document.getElementById("inputEmail").style.border = "1px solid red;"
        document.getElementById("inputEmail").focus();
    } else if (!adresse) {
        document.getElementById("inputAdresse").style.border = "1px solid red;"
        document.getElementById("inputAdresse").focus();
    } else if (!plzOrt) {
        document.getElementById("inputOrt").style.border = "1px solid red;"
        document.getElementById("inputOrt").focus();
    } else {
		var endMsgContainer = document.querySelector(".endMsgContainer");
		endMsgContainer.innerHTML = `
			<h2 class="endMsgTitle">TICKETKAUF ERFOLGREICH</h2>
			<p class="endMsgTextOne"> Herzlichen Dank Herr/Frau ${lastname} ${firstname} für Ihren Ticketkauf. Ihr Ticket Nr.XXX wird Ihnen per E-mail an ${email} zugestellt.</p>
			<div class="endMsgButtonsContainer">
				<button class="endMsgBtn downloadBtn">TICKET HERUNTERLADEN</button>
				<button class="endMsgBtn nachbestellenBtn">TICKETS NACHBESTELLEN</button>   
				<button class="endMsgBtn zuruckBtnTwo" onclick="start();">ZURÜCK ZUR STARTSEITE</button>  
			</div>
			<p class="endMsgTextTwo"> Wir freuen uns, Sie bald am Swiss Green Economy Symposium begrüssen zu dürfen.</p>
		`;
		
		document.getElementById("warenkorb").style.display = "none";
		document.getElementById("step1").style.display = "none";
		document.getElementById("step2").style.display = "block";
		var clearFields = document.getElementById("clearField").querySelectorAll("input");
		clearFields.forEach((element) => {
			if (element.type == "text") {
				element.value = "";
			} else if (element.type == "checkbox") {
				element.checked = false;
				}
			});
			
		initialState.cart = [];
		cartTotal.innerHTML = "";
		cartElement.innerHTML = "<p class='cartLeer'>DEIN WARENKORB IST MOMENTAN LEER</p>";
    } 
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
            blocks = response.message;
            
            var sortBlocks = blocks.slice().sort((a, b) => Date.parse(a.neues_datum) - Date.parse(b.neues_datum));
			blocks = sortBlocks;
			console.log(blocks);
            
            var textContainer = document.querySelector(".display");
			textContainer.innerHTML = "";
			var currentDate = "1600-01-01";
			blocks.forEach(function (block, i) {
				//globalBlocks.push(block);
				var card = document.createElement('div');
				card.classList.add('filterDiv');
				
				if (Date.parse(block.neues_datum) != Date.parse(currentDate) ) {
					currentDate = block.neues_datum;
			
					var dateTitle = document.createElement('div');
					dateTitle.innerHTML += `<div style="display: none" id="vormittag_${block.neues_datum}"><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'> ${block.neues_datum} </td> <td class='timeName'>VORMITTAG</td> </tr> </table></div>`;
					dateTitle.innerHTML += `<div style="display: none" id="nachmittag_${block.neues_datum}"><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'> ${block.neues_datum} </td> <td class='timeName'>NACHMITTAG</td> </tr> </table></div>`;
					dateTitle.innerHTML += `<div style="display: none" id="abend_${block.neues_datum}"><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'> ${block.neues_datum} </td> <td class='timeName'>ABEND</td> </tr> </table></div>`;
					textContainer.appendChild(dateTitle);
				}

				card.innerHTML += `<div class='blockContainer'> <p class='blockTime'>  ${block.short_name} &nbsp;&nbsp;&nbsp; ${block.time} </p> <p class='blockTitle'>  ${block.official_title} </p> <p class='blockText'>  ${block.sub_title} </p><div>`;
				card.innerHTML += `<div class='buttonsContainer'> <a href="https://sges.ch/about" target="_blank" class='info'><img class='infoImg' src="https://cdn-icons-png.flaticon.com/512/1828/1828885.png"/></a> <div class='cart' onclick="addToCart(${i})"><img class='cartImg' src="https://cdn-icons-png.flaticon.com/512/628/628543.png"/></div> </div>`;
			
				
				if (block.time) {
					var twoTimeRange = block.time.split("und");
					
					if (twoTimeRange.length > 1) {
						for (var i = 0; i < twoTimeRange.length; i++ ) {
							
							var OnetimeRange = twoTimeRange[i].split("-");
							var timeFilter = checkTime(OnetimeRange);
							  for (var j = 0; j < timeFilter.length; j++ ) {
								  if (timeFilter[j] == 1) {
									  card.classList.add('vormittag');
										document.getElementById(`vormittag_${block.neues_datum}`).appendChild(card);
									  } else if ( timeFilter[j] == 2){
										  card.classList.add('nachmittag');
										  document.getElementById(`nachmittag_${block.neues_datum}`).appendChild(card);
										  } else {
											  card.classList.add('abend');
											  document.getElementById(`abend_${block.neues_datum}`).appendChild(card);
											  }
								  }
							}
						} else {
							
							var OnetimeRange = block.time.split("-");
							var timeFilter = checkTime(OnetimeRange);
							  for (var i = 0; i < timeFilter.length; i++ ) {
								  if (timeFilter[i] == 1) {
									  card.classList.add('vormittag');
									  document.getElementById(`vormittag_${block.neues_datum}`).appendChild(card);
									  } else if ( timeFilter[i] == 2){
										  card.classList.add('nachmittag');
										  document.getElementById(`nachmittag_${block.neues_datum}`).appendChild(card);
										  } else {
											  card.classList.add('abend');
											  document.getElementById(`abend_${block.neues_datum}`).appendChild(card);
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
			
			for (var i = 0; i < blocks.length; i++ ) {
				if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}`).querySelector(".blockContainer") == null) {
					document.getElementById(`vormittag_${blocks[i].neues_datum}`).remove();
						
					}
				}
				if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`).querySelector(".blockContainer") == null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}`).remove();
					}
				} 
				if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
					if (document.getElementById(`abend_${blocks[i].neues_datum}`).querySelector(".blockContainer") == null) {
						document.getElementById(`abend_${blocks[i].neues_datum}`).remove();
					}
				} 	
			};
							      
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
