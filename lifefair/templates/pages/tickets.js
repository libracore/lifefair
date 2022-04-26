var blocks;
var interests = [];
var itemVal;
var currentTimeSlot = "all";
var datumFlag = 0;
var inTheChekout = false;
var initialState = {
	userTypeValue : 0,
	cart : [] //|| JSON.parse(localStorage.getItem("CART")); 
};

var cartElement = document.querySelector(".cartElement");
var cartTotal = document.querySelector(".cartTotal");
var cartbButton = document.getElementById("btnCart");
var selectedFilterDiv = document.getElementById("selectedFilters");
var btnContainerOne = document.getElementById("filterBtnContainerOne").querySelectorAll("button");
var btnContainerTwo = document.getElementById("filterBtnContainerTwo").querySelectorAll("button");
var btnContainerThree = document.getElementById("filterBtnContainerThree");
var clearFields = document.getElementById("clearField").querySelectorAll("input");
var clearFieldsTwo = document.getElementById("clearFieldTwo").querySelectorAll("input");
var popUpDiv = document.getElementById("modal");
var errorContainer = document.querySelector(".error");


updateCart();
//endMsg();
//console.log("in the clearFields", clearFields);
//console.log("in the clearFieldsTwo", clearFieldsTwo);
//filterSelection("all", undefined);

function userSelection(c) {
	
	  switch (c) {
		case 'privatperson':
			initialState.userTypeValue = 2.00;
			break;
		case 'student':
			initialState.userTypeValue = 2.50;
			break;
		case 'AHV/IV RENTNER':
			initialState.userTypeValue = 3.00;
			break;
		case 'ARBEITSSUCHEND':
			initialState.userTypeValue = 4.25;
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
	document.getElementById("warenkorb").classList.remove("grey");
	document.querySelector(".display").classList.remove("grey");
	btnContainerTwo.forEach((element) => element.classList.add("btnHover"));
	document.getElementById("filterBtnContainerThree").querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	console.log("the user", initialState.userTypeValue);
	var userMenu = document.getElementById("userMenu");
	var userMenuDiv = document.createElement('div');
	userMenuDiv.classList.add('userMenuDiv');
	userMenuDiv.innerHTML = `<div class="userMenuClass" onclick="openDropdown()"><p>${c}</p> <img class='dropdownImg' src="/assets/lifefair/images/arrow.png"/></div>`;
	userMenu.insertBefore(userMenuDiv, userMenu.firstChild)
    document.getElementById("dropdown").querySelectorAll("button").forEach((element) => element.style.display = "none");
    
	if ( document.getElementById("selectedFilters").contains(document.querySelector(".grey")) == true) document.getElementById("selectedFilters").classList.remove("grey");
	// Like this all the blocks will automatically appear 
	filterTimeSlot("all");
	

}

//Dropdown Menu
function openDropdown() {
	document.getElementById("dropdown").querySelectorAll("button").forEach((element) => element.style.display = "block");
    document.querySelector(".userMenuDiv").innerHTML =  "";
}

function filterSelection(c, button) {
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
	} else {
	
	    var newStr = c;
	    var x, i;
	    
	    if (c.split(/\W+/).length > 1) {
		  newStr =  c.split(" ")[0];
	    }
	    x = document.getElementsByClassName("filterDiv");
	    if (newStr == "all") newStr = "";
	    for (i = 0; i < x.length; i++) {
		  removeClass(x[i], "show");
		  if (x[i].className.indexOf(newStr) > -1) addClass(x[i], "show");
	    }
	    titleFilter(newStr);
	    blueThemaActive(newStr, button);    
	}
	
}

function titleFilter(c) {
	
	var flag = 0;
	
	if (c) {
	
	for (var i = 0; i < blocks.length; i++ ) {
		
		if (document.getElementById(`vormittag_${blocks[i].neues_datum}`) != null) {
			if (document.getElementById(`vormittag_${blocks[i].neues_datum}`).querySelector(`.${c}`) == null) {
				document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "none";					
			} else {
				if (currentTimeSlot == "vormittag" || currentTimeSlot == "all") {
					flag = 1;
					document.getElementById(`vormittag_${blocks[i].neues_datum}`).style.display = "block";
				}
			}
		}
		if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`) != null) {
			if (document.getElementById(`nachmittag_${blocks[i].neues_datum}`).querySelector(`.${c}`) == null) {
				document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "none";
					
			} else {
				if (currentTimeSlot == "nachmittag" || currentTimeSlot == "all") {
					flag = 1;
					document.getElementById(`nachmittag_${blocks[i].neues_datum}`).style.display = "block";
				}
			}
		} 
		if (document.getElementById(`abend_${blocks[i].neues_datum}`) != null) {
			if (document.getElementById(`abend_${blocks[i].neues_datum}`).querySelector(`.${c}`) == null) {
				document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "none";
					
			} else {
				if (currentTimeSlot == "abend" || currentTimeSlot == "all") {
					flag = 1;
					document.getElementById(`abend_${blocks[i].neues_datum}`).style.display = "block";
				}
			}
		} 	
	}
	
	if ( flag == 0) {
			errorContainer.innerHTML = "Keine Ereignisse gefunden";
	} else {
			errorContainer.innerHTML = "";
	}
 }
}

function filterTimeSlot(c) {
	//datumFlag == 0;
	currentTimeSlot = c;
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
	} else {
	
		if (selectedFilterDiv.children.length == 3) {
			errorContainer.innerHTML = "";
			btnContainerThree.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
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
  var newStr;
  var i, arr1, arr2;
  
  if (name.split(/\W+/).length > 1) {
	 newStr =  name.split(" ")[0];
	 arr1 = element.className.split(" ");
	 arr2 = newStr.split(" ");
	 for (i = 0; i < arr2.length; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
     }
  } else {
	 arr1 = element.className.split(" ");
	 arr2 = name.split(" ");
	 for (i = 0; i < arr2.length; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
	 }
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
btnContainerOne.forEach((element) => {
	element.addEventListener("click", function(){
		
		btnContainerOne.forEach(btn => {
			btn.classList.remove("active");
		});
		
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

btnContainerTwo.forEach((element) => {
	element.addEventListener("click", function(){
		//console.log("theeeeeeeeee eleeeeeemeeeent", element)
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

function blueThemaActive(c, button = undefined) {
	//console.log("in the blue thema button", btnContainerThree.querySelectorAll("button"));
	
	if (initialState.userTypeValue == 0) {
			//console.log("in the button thema clicked", element);
			document.getElementById("ichBin").classList.add("shake");
		} else if (c != null && c.length != 0 && button != undefined) {
			document.getElementById("ichBin").classList.remove("shake");
			btnContainerThree.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
			button.classList.add("active");
			
			var blueThema = document.querySelector(".themaBlueFilter");
			var answer = selectedFilterDiv.contains(blueThema);
			var blueFilterBlock;
			if (answer == true) {
				console.log("in the blueThema true")
				var themaChildLi = selectedFilterDiv.getElementsByTagName('li')[2];
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 3)">X</div>`;
				blueFilterBlock.classList.add('themaBlueFilter');
				blueFilterBlock.classList.add('filter');
				selectedFilterDiv.replaceChild(blueFilterBlock, themaChildLi);		
			} else {
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(this, 3)">X</div>`;
				blueFilterBlock.classList.add('themaBlueFilter');
				blueFilterBlock.classList.add('filter');
				selectedFilterDiv.appendChild(blueFilterBlock);
			}			
			
		}	
}

function removeFilter(li, num) {
	//console.log("li", li);
	li.parentNode.parentNode.removeChild(li.parentNode);
	errorContainer.innerHTML = "";
	
	if (num == 1 ){
		btnContainerOne.forEach(btn => {
			btn.classList.remove("active");
			btn.style.display = "block";
		});
		initialState.userTypeValue = 0;
		document.getElementById("selectedFilters").classList.add("grey");
		document.getElementById("warenkorb").classList.add("grey");
		document.getElementById("filterBtnContainerTwo").classList.add("grey");
		document.getElementById("filterBtnContainerThree").classList.add("grey");
		document.querySelector(".display").classList.add("grey");
		
		//btnContainerTwo.forEach(btn => btn.classList.remove("active"));
		//btnContainerThree.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		btnContainerTwo.forEach((element) => element.classList.remove("btnHover"));
		btnContainerThree.querySelectorAll("button").forEach((element) => element.classList.remove("btnHover"));
		document.querySelector(".userMenuDiv").innerHTML =  "";
	} else if ( num == 2) {
		if (selectedFilterDiv.children.length == 2) selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		btnContainerTwo.forEach(btn => btn.classList.remove("active"));
		btnContainerThree.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		//datumFlag = 1;
		
	} else if ( num == 3) {
		btnContainerThree.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
		filterTimeSlot(selectedFilterDiv.children[1].textContent.split(" ")[0].toLowerCase());		
	}
	
	if (selectedFilterDiv.children.length == 1) {
		filterTimeSlot("all");
		document.getElementById('all').click();
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
		console.log("already there", blocks[i].short_name);
		//document.getElementById("warenkorb").classList.add("shake");
		 } else if (initialState.cart.some((item) => item.neues_datum == blocks[i].neues_datum)) {
			 popUp(i);
		 } else {
			initialState.cart.push({
				 ...blocks[i], 
			});
		 }	
		updateCart();
	} 
}

function popUp(i) {
	var currentCartItem;
	initialState.cart.some((item) => {
		if (item.neues_datum == blocks[i].neues_datum) currentCartItem = item;
	})
	popUpDiv.innerHTML = `
			<div class="popUp"> 
				<div class="popUpContent"> 
					<p class="popUpTittle">SIND SIE SICHER?</p> 
					<p class="popUpText">Sie buchen zwei Tickets um dieselbe Uhrzeit</p> 
					<table class="popUpTable"> 					
						<tr><td style="width: 50%;">${currentCartItem.short_name} <br> ${currentCartItem.official_title.split(":")[0]}</td> <td style="text-align: right; padding-right: 40px">${currentCartItem.neues_datum}</td> <td class="popUpImg"><div><img src="/assets/lifefair/images/minus.png" style="width:12px; "/></div></td></tr> 				
						<tr><td></td><td></td><td></td><td></td></tr>
						<tr> <td style="width: 50%;">${blocks[i].short_name} <br> ${blocks[i].official_title.split(":")[0]}</td> <td style="text-align: right; padding-right: 40px">${blocks[i].neues_datum}</td> <td class="popUpImg"><div><img src="/assets/lifefair/images/plus.png" style="width:12px; " /></div></td></tr>
					</table>
					<div class="popUpBtnDiv"> 
						<button class="popUpCancel" onclick="popUpCancel()">BESTÄTIGEN</button> <button class="popUpConfirm" onclick="popUpConfirm(${i})">UMBUCHEN</button> 
					</div>
				</div>
			</div> `;	
	popUpDiv.style.display = "block";
	console.log("the same day is not possible" );
}

function popUpConfirm(i) {
	popUpDiv.style.display = "none";
	var index = initialState.cart.findIndex(item => item.neues_datum == blocks[i].neues_datum);
	console.log("the indeeex of iteem", index);
	
	initialState.cart[index] = blocks[i];
	updateCart();

	console.log("in the popUp confirm", blocks[i]);
}

function popUpCancel() {
	popUpDiv.style.display = "none";
	console.log("in the popUp cancel");
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
			cartTotal.innerHTML = `<div class="alleArtikel">Alle Artikel entfernen</div> <div class="totalDisplay"><p>TOTAL</p> <p>${totalPrice.toFixed(2)}</p></div>`;	
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
    document.getElementById("step3").style.display = "none";
    // prepare topic
    cartbButton.innerHTML = `<p onclick="checkOut()" class="cartBtnText">ZUM WARENKORB</p>`
    clearFields.forEach((element) => {
		if (element.type == "text") {
			element.value = "";
		} else if (element.type == "checkbox") {
			element.checked = false;
		}
	});
	
	clearFieldsTwo.forEach((element) => {
		if (element.type == "text") {
			element.value = "";
		}
	});

}

function checkOut() {
	
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.add("shake");
	} else if (initialState.cart.length == 0) {
		var shaketext = document.querySelector(".cartLeer")
			shaketext.classList.add("shake");
		} else {
			inTheChekout = true;
			document.getElementById("step0").style.display = "none";
			document.getElementById("step1").style.display = "block"
			cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT ZAHLEN</p>`
		}
}

//Watching over the checkbox in the checkout 
var rechnungAdresse = document.getElementById("gleiche");
rechnungAdresse.checked = false;
rechnungAdresse.addEventListener('change', function(e){
	if (rechnungAdresse.checked) {
		console.log("Gleiche check");
		document.getElementById("step2").style.display = "block"	
	} else if (!rechnungAdresse.checked) {
		console.log("not Gleiche check");
		document.getElementById("step2").style.display = "none"
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
    } else if (rechnungAdresse.checked) {
		rechnungAdresseChecked();
	} else {	
		
		frappe.call({
        'method': 'lifefair.lifefair.tickets.create_ticket',
        'args': {
            'lastname': lastname, 
            'firstname': firstname,
            'firma': firma,
            'funktion': funktion,
            'phone': phone,
            'email': email,  
            'adresse': adresse, 
            'plzOrt': plzOrt,
            'warenkorb': initialState.cart 
        },
        'callback': function(response) {
            var registrationen = response.message;
            openStripe();
            // invoice created
            //var payment = response.message;          
        }
    });
	}
}

//Cheking the Values of Rechnung Adresse if checked
function rechnungAdresseChecked() {
	console.log("rechnungAdresseChecked");
	
	var lastnameTwo = document.getElementById("inputSurnameTwo").value;
	var firstnameTwo = document.getElementById("inputFirstnameTwo").value;
	var firmaTwo = document.getElementById("inputFirmaTwo").value;
	var funktionTwo = document.getElementById("inputFunktionTwo").value;
	var phoneTwo = document.getElementById("inputPhoneTwo").value;
    var emailTwo = document.getElementById("inputEmailTwo").value;  
    var adresseTwo = document.getElementById("inputAdresseTwo").value;
    var plzOrtTwo = document.getElementById("inputOrtTwo").value;
    
    console.log(lastnameTwo, firstnameTwo, firmaTwo, funktionTwo, phoneTwo, emailTwo, adresseTwo, plzOrtTwo);
    
    if (!lastnameTwo) {
        document.getElementById("inputSurnameTwo").style.border = "1px solid red;"
        document.getElementById("inputSurnameTwo").focus();
    } else if (!firstnameTwo) {
        document.getElementById("inputFirstnameTwo").style.border = "1px solid red;"
        document.getElementById("inputFirstnameTwo").focus();
    } else if (!firmaTwo) {
        document.getElementById("inputFirmaTwo").style.border = "1px solid red;"
        document.getElementById("inputFirmaTwo").focus();
    } else if (!funktionTwo) {
        document.getElementById("inputFunktionTwo").style.border = "1px solid red;"
        document.getElementById("inputFunktionTwo").focus();
    } else if (!phoneTwo) {
        document.getElementById("inputPhoneTwo").style.border = "1px solid red;"
        document.getElementById("inputPhoneTwo").focus();
    } else if (!emailTwo) {
        document.getElementById("inputEmailTwo").style.border = "1px solid red;"
        document.getElementById("inputEmailTwo").focus();
    } else if (!adresseTwo) {
        document.getElementById("inputAdresseTwo").style.border = "1px solid red;"
        document.getElementById("inputAdresseTwo").focus();
    } else if (!plzOrtTwo) {
        document.getElementById("inputOrtTwo").style.border = "1px solid red;"
        document.getElementById("inputOrtTwo").focus();
    } else {	
		openStripe();
	} 
}
   
function openStripe(){
	window.open("https://buy.stripe.com/test_14k8Az0qtbPC8KseUW", "_self");
}

function loadBlocks(anlass) {
	console.log(anlass);
	frappe.call({
		'method': "lifefair.lifefair.tickets.get_blocks",
		'args': {
			meeting: anlass
		},
		'callback': function (response) {
            blocks = response.message;
			console.log(blocks);
            
            var blocksContainer = document.querySelector(".display");
			blocksContainer.innerHTML = "";
			var currentDate = null;
			blocks.forEach(function (block, x) {
				
				var card = document.createElement('div');
				card.classList.add('filterDiv');
				
				if (block.neues_datum !== currentDate) {
					currentDate = block.neues_datum;
				
					var dateTitle = document.createElement('div');
					var date = block.neues_datum.split("-").reverse().join(".");
					var day = new Date(currentDate);
					var dayName = day.toLocaleString('de-ch', {weekday: 'long'});
					
					dateTitle.innerHTML += `<div style="display: none" id="vormittag_${block.neues_datum}"><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'>${dayName}</td><td class='dateNum'> ${date}</td> <td class='timeName'>VORMITTAG</td> </tr> </table></div>`;
					dateTitle.innerHTML += `<div style="display: none" id="nachmittag_${block.neues_datum}"><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'>${dayName}</td><td class='dateNum'> ${date}</td>  <td class='timeName'>NACHMITTAG</td> </tr> </table></div>`;
					dateTitle.innerHTML += `<div style="display: none" id="abend_${block.neues_datum}"><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'>${dayName}</td><td class='dateNum'> ${date}</td>  <td class='timeName'>ABEND</td> </tr> </table></div>`;
					blocksContainer.appendChild(dateTitle);
				}
				
				card.innerHTML += `<div class='blockContainer'> <div class='blockTime'>  <div> ${block.short_name} </div><div> ${block.time}</div> </div> <p class='blockTitle'>  ${block.official_title} </p> <p class='blockText'>  ${block.location} </p><div>`;
				card.innerHTML += `<div class='buttonsContainer'> <a href="${block.website_link}" target="_blank" class='info'><img class='infoImg' src="/assets/lifefair/images/info.png"/></a> <div class='cart' onclick="addToCart(${x})"><img class='cartImg' src="/assets/lifefair/images/cart.png"/></div> </div>`;
			
				
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
				
				//creating the filter thema buttons and adding the class to the card
				var blockInterest = block.interests.split(",");
				blockInterest.forEach(function (int) {
					addClass(card, int);
					if (interests.indexOf(int) == -1) { 
						interests.push(int);
						var themBtn = document.getElementById("filterBtnContainerThree");
						themBtn.innerHTML += `<button class="btn" onclick="filterSelection('${int}', this)">${int}</button>`
					}
				});
						
			});
			//console.log("all block interes", interests);
			
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
							      
		}
	});
	
}

function loadEndMsg() {
	
	document.getElementById("warenkorb").style.display = "none";
	document.getElementById("step0").style.display = "none";
	document.getElementById("step1").style.display = "none";
	document.getElementById("step3").style.display = "block";
	
	frappe.call({
		'method': "lifefair.lifefair.tickets.get_person",
		'callback': function (response) {
            person = response.message;
			console.log('the person', person[0]);
			
			var endMsgContainer = document.getElementById("step3");
			endMsgContainer.innerHTML = `
				<h1 class="endMsgTitle">TICKETKAUF ERFOLGREICH</h1>
				<p class="endMsgTextOne"> Herzlichen Dank Herr/Frau ${person[0].full_name} für Ihren Ticketkauf. Ihr Ticket Nr.${person[0].name}  wird Ihnen per E-mail an ${person[0].email}  zugestellt.</p>
				<div class="infoDiv"><div class="infoI">i</div>Networking Lunch inklusive Übernachtung empfohlen.</div>
				<div class="endMsgButtonsContainer">
					<a href="/assets/lifefair/images/info.png" class="endMsgBtn downloadBtn" download>TICKET HERUNTERLADEN</a>
					<button class="endMsgBtn nachbestellenBtn">TICKETS NACHBESTELLEN</button>
					<a href="https://sges.ch/" target="_self" class="endMsgBtn zuruckBtnTwo">ZURÜCK ZUR STARTSEITE</a>   
					
				</div>
				<p class="endMsgTextTwo"> Wir freuen uns, Sie bald am Swiss Green Economy Symposium begrüssen zu dürfen.</p>
			`;
		}
	});
	
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
        console.log('args', args )
        if (args['anlass']) {
			if (args['anlass'] == 'ticketkauf') {
				loadEndMsg();
			} else {
				console.log('args with anlass', args['anlass'] )
				loadBlocks(args['anlass']);
			}
		}
    } 
}
