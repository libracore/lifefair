var blocks;
var interests = [];
var itemVal;
var dayName;
var currentDatum = null;
var currentTimeSlot = "all";
var currentZeit = null;
var currentThema = null;
//var datumFlag = 0;
var inTheChekout = false;
var initialState = {
	userTypeValue : JSON.parse(localStorage.getItem("USER")) || [],
	cart : JSON.parse(localStorage.getItem("CART")) || [],
	addressOne: JSON.parse(localStorage.getItem("ADDRESSONE")) || [],
	addressTwo: JSON.parse(localStorage.getItem("ADDRESSTWO")) || [],
	cartTwo: JSON.parse(localStorage.getItem("CARTTWO")) || [],
	info: JSON.parse(localStorage.getItem("INFO")) || [],
	rechCheck: JSON.parse(localStorage.getItem("RECHCHECK")) || [],
};
var tags = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag" ];

var cartElement = document.querySelector(".cartElement");
var cartTotal = document.querySelector(".cartTotal");
var cartbButton = document.getElementById("btnCart");
var selectedFilterDiv = document.getElementById("selectedFilters");
var btnContainerOne = document.getElementById("filterBtnContainerUSER").querySelectorAll("button");
var btnContainerTwo = document.getElementById("filterBtnContainerDATUM");
var btnContainerThree = document.getElementById("filterBtnContainerZEIT").querySelectorAll("button");
var btnContainerFour = document.getElementById("filterBtnContainerTHEMA");
var clearFields = document.getElementById("clearField").querySelectorAll("input");
var clearFieldsTwo = document.getElementById("clearFieldTwo").querySelectorAll("input");
var popUpDiv = document.getElementById("modal");
var errorContainer = document.querySelector(".error");
var active = document.querySelector(".active");

updateCart();
//endMsg();
//console.log("in the clearFields", clearFields);
//console.log("in the clearFieldsTwo", clearFieldsTwo);
//filterSelection("all");

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
	localStorage.setItem("USER", JSON.stringify(initialState.userTypeValue));
	
	document.getElementById("ichBin").classList.remove("shake");
	document.getElementById("filterBtnContainerDATUM").classList.remove("grey");
	document.getElementById("filterBtnContainerZEIT").classList.remove("grey");
	document.getElementById("filterBtnContainerTHEMA").classList.remove("grey");
	document.getElementById("warenkorb").classList.remove("grey");
	document.querySelector(".display").classList.remove("grey");
	btnContainerTwo.querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	btnContainerThree.forEach((element) => element.classList.add("btnHover"));
	btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	console.log("the user", initialState.userTypeValue);
	var userMenu = document.getElementById("userMenu");
	var userMenuDiv = document.createElement('div');
	userMenuDiv.classList.add('userMenuDiv');
	userMenuDiv.innerHTML = `<div class="userMenuClass" onclick="openDropdown()"><p>${c}</p> <img class='dropdownImg' src="/assets/lifefair/images/arrow.png"/ style="padding-top: 5px;"></div>`;
	userMenu.insertBefore(userMenuDiv, userMenu.firstChild)
    document.getElementById("dropdown").querySelectorAll("button").forEach((element) => element.style.display = "none");
    
	if ( document.getElementById("selectedFilters").contains(document.querySelector(".grey")) == true) document.getElementById("selectedFilters").classList.remove("grey");
	// Like this all the blocks will automatically appear 
	titleShowAll();
}

//Dropdown Menu
function openDropdown() {
	document.getElementById("dropdown").querySelectorAll("button").forEach((element) => element.style.display = "block");
    document.querySelector(".userMenuDiv").innerHTML =  "";
}

function filterDatum(c, button) {
	currentTimeSlot = "all";
	dayName = "iAmNull";
	titleFilter(dayName);
	dayName = c;

	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.toggle("shake");
	} else {
		currentDatum = c;
		currentZeit = null;
		if (selectedFilterDiv.children.length == 3) {
			errorContainer.innerHTML = "";
			btnContainerThree.forEach(btn => btn.classList.remove("active"));
			btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		}  else if (selectedFilterDiv.children.length == 4) {
			errorContainer.innerHTML = "";
			btnContainerThree.forEach(btn => btn.classList.remove("active"));
			btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
			btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild); 
		}
			var x, i;
			
			x = document.getElementsByClassName("filterDiv");
			//if (c == "all") c = "";
			for (i = 0; i < x.length; i++) {
			  removeClass(x[i], "show");
			  if (x[i].className.indexOf(c) > -1) addClass(x[i], "show");
			}
			
			blueThemaActive(c, button);
			titleFilter(dayName);
			//console.log('newStr c', c);
			//console.log('dayName', dayName);
		}
}

function filterSelection(c, button) {
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.toggle("shake");
	} else if (currentDatum == null) {
		document.getElementById("datum").classList.toggle("shake");
	} else if (currentZeit == null) {
		document.getElementById("zeit").classList.toggle("shake");
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
	    cardFilter(newStr);
		blueThemaActive(newStr, button);
		currentThema = newStr;
	}
}

function titleShowAll() {
	var localTitle;
	currentTimeSlot = "all";
	
	localTitle = document.querySelectorAll('.localTitle_vormittag');
	//console.log('localTitle', localTitle);
	for ( var j = 0; j < localTitle.length; j++ ) {
		if (localTitle[j].children.length > 1) {
			localTitle[j].style.display = "block";
		}
	}
	
	localTitle = document.querySelectorAll('.localTitle_nachmittag');
	for ( var j = 0; j < localTitle.length; j++ ) {
		if (localTitle[j].children.length > 1) {
			localTitle[j].style.display = "block";
		}
	}
	
	localTitle = document.querySelectorAll('.localTitle_abend');
	for ( var j = 0; j < localTitle.length; j++ ) {
		if (localTitle[j].children.length > 1) {
			localTitle[j].style.display = "block";
		}
	}
	
	//Show all cards
	localTitle = document.querySelectorAll('.filterDiv');
	for ( var j = 0; j < localTitle.length; j++ ) {
		//if (localTitle[j].children.length > 1) {
			localTitle[j].style.display = "block";
		//}
	}
}

function titleFilter(c) {
	//console.log("c in title", c);
	var flag = 0;
	var localTitle;
	
	if (dayName == "iAmNull" ) {
		localTitle = document.querySelectorAll('.localTitle_vormittag');
		//console.log('localTitle', localTitle);
		for ( var j = 0; j < localTitle.length; j++ ) {
			localTitle[j].style.display = "none";
			}
		localTitle = document.querySelectorAll('.localTitle_nachmittag');
		
		for ( var j = 0; j < localTitle.length; j++ ) {
			localTitle[j].style.display = "none";
			}
		localTitle = document.querySelectorAll('.localTitle_abend');
		
		for ( var j = 0; j < localTitle.length; j++ ) {
			localTitle[j].style.display = "none";
			}
		//Show all cards
		localTitle = document.querySelectorAll('.filterDiv');
		for ( var j = 0; j < localTitle.length; j++ ) {
			localTitle[j].style.display = "block";
			}
	}
	
	if (c != "" && c != null) {

	for (var i = 0; i < blocks.length; i++ ) {
		
		if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`) != null) {
			if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).querySelector(`.${c}`) == null) {
				document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "none";
				//console.log("in the if 1 on the title filter", c)
			} else {
				if (currentTimeSlot == "vormittag" || currentTimeSlot == "all") {
					flag = 1;
					document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";
					//console.log('i the if 2 document', document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).querySelector(`.${c}`))
					//console.log("in the if 2 on the title filter", c)
				}
			}
		}
		if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`) != null) {
			if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).querySelector(`.${c}`) == null) {
				document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).style.display = "none";
					
			} else {
				if (currentTimeSlot == "nachmittag" || currentTimeSlot == "all") {
					flag = 1;
					document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";
				}
			}
		} 
		if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`) != null) {
			if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).querySelector(`.${c}`) == null) {
				document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).style.display = "none";
					
			} else {
				if (currentTimeSlot == "abend" || currentTimeSlot == "all") {
					flag = 1;
					document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).style.display = "block";
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

function cardFilter(c) {
	var flag = 0;
	//Show all cards
	var localTitle = document.querySelectorAll('.filterDiv');
	for ( var j = 0; j < localTitle.length; j++ ) {
		//if (localTitle[j].children.length > 1) {
			localTitle[j].style.display = "none";
		//}
	}
	if (c != "" && c != null) {
		console.log("c and currentTimeSlot", c, currentTimeSlot, dayName)
		
		if ( currentTimeSlot == "vormittag" ) {
			var vormittagCards = document.querySelectorAll('.filterDiv');
			for (var i = 0; i < vormittagCards.length - 1; i++ ) {
				
				if ( vormittagCards[i].classList.contains(`${dayName}`) == false || vormittagCards[i].classList.contains(`${c}`) == false || vormittagCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
					//console.log("in the vormittagCards with i", vormittagCards[i].classList.contains(`${c}`))
					vormittagCards[i].style.display = "none";
					//console.log("in the if 1 on the card filter vormittag", c)
				} else {
					//console.log("in the vormittagCards with i", vormittagCards[i])
						flag = 1;
						vormittagCards[i].style.display = "block";
						//console.log("in the if 2 on the card filter vormittag", c)
						titleFilter(dayName)
				}
			}
		}
		if ( currentTimeSlot == "nachmittag" ) {
			var nachmittagCards = document.querySelectorAll('.filterDiv');
			for (var i = 0; i < nachmittagCards.length - 1; i++ ) {
				
				if ( nachmittagCards[i].classList.contains(`${dayName}`) == false || nachmittagCards[i].classList.contains(`${c}`) == false || nachmittagCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
					//console.log("in the nachmittagCards with i", nachmittagCards[i].classList.contains(`${c}`))
					nachmittagCards[i].style.display = "none";
					//console.log("in the if 1 on the card filter nachmittag", c)
				} else {
					//console.log("in the if 2 on the card filter nachmittag", c)
						flag = 1;
						nachmittagCards[i].style.display = "block";
						console.log("in the nachmittagCards 2 with i", nachmittagCards[i])
						titleFilter(dayName)
				}
			}
		}
		if ( currentTimeSlot == "abend") {
			var abendCards = document.querySelectorAll('.filterDiv');
			for (var i = 0; i < abendCards.length - 1; i++ ) {
				
				if ( abendCards[i].classList.contains(`${dayName}`) == false || abendCards[i].classList.contains(`${c}`) == false || abendCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
					//console.log("in the abendCards with i", abendCards[i].classList.contains(`${c}`))
					abendCards[i].style.display = "none";
					//console.log("in the if 1 on the card filter abend", c)
				} else {
					//console.log("in the abendCards with i", abendCards[i])
						flag = 1;
						abendCards[i].style.display = "block";
						//console.log("in the if 2 on the card filter abend", c)
						titleFilter(dayName)
				}
			}
		}	
	
	
	if ( flag == 0) {
			//c = "none"
			titleFilter(c)
			errorContainer.innerHTML = "Keine Ereignisse gefunden";
	} else {
			errorContainer.innerHTML = "";
	}
 }
}

function filterTimeSlot(c) {
	//console.log("c in time filter", c);
	var flag = 0;
	//datumFlag == 0;
	currentTimeSlot = c;
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.toggle("shake");
	} else if (currentDatum == null) {
		document.getElementById("datum").classList.toggle("shake");
	} else {
		
		if (selectedFilterDiv.children.length == 4) {
			errorContainer.innerHTML = "";
			btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
			btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		} 
		currentZeit = c;
		
		//Show all cards
		localTitle = document.querySelectorAll('.filterDiv');
		for ( var j = 0; j < localTitle.length; j++ ) {
			//if (localTitle[j].children.length > 1) {
				localTitle[j].style.display = "block";
			//}
		}
		
		for (var i = 0; i < blocks.length; i++ ) {
		//var tags = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag" ]; For Reference.
		// var currentDatum = null; For Reference.
			switch (c) {
				case 'vormittag':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`) != null && document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).children.length > 1) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";	
						flag = 1;
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`)!= null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).style.display = "none";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`) != null) {
						document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).style.display = "none";	
					}
					break;
				case 'nachmittag':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`) != null) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "none";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`) != null && document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).children.length > 1) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";	
						flag = 1;
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`) != null) {
						document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).style.display = "none";	
					}
					break;
				case 'abend':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`) != null) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "none";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`) != null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).style.display = "none";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`) != null && document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).children.length > 1) {
						document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).style.display = "block";	
						flag = 1;
					}
					break;
				case 'all':
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`) != null && document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).children.length > 1) {
						document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";	
					}
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`) != null && document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).children.length > 1) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";	
					}
					if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`) != null && document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).children.length > 1) {
						document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).style.display = "block";	
					}
					flag = 1;
					break;
			}	 		 	
		}
		
		if ( flag == 0) {
			errorContainer.innerHTML = "Keine Ereignisse gefunden";
		} else {
				errorContainer.innerHTML = "";
		}
		//filterSelection("all");
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
			orangeFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(1)">X</div>`;
			orangeFilterBlock.classList.add('orangeFilter');
			orangeFilterBlock.classList.add('filter');
			selectedFilterDiv.replaceChild(orangeFilterBlock, userTypeChildLi);
			
		} else {
			orangeFilterBlock = document.createElement('li');
			orangeFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(1)">X</div>`;
			orangeFilterBlock.classList.add('orangeFilter');
			orangeFilterBlock.classList.add('filter');
			selectedFilterDiv.insertBefore(orangeFilterBlock, selectedFilterDiv.firstChild);
		}
		
		this.classList.add("active");
	}); 
});

btnContainerThree.forEach((element) => {
	element.addEventListener("click", function(){
		//console.log("theeeeeeeeee eleeeeeemeeeent", element)
		if (initialState.userTypeValue == 0) {
			console.log("user missing");
		} else if (currentDatum == null) {
			console.log("datum missing");
		} else {
			document.getElementById("ichBin").classList.remove("shake");
			//btnContainerThree.forEach(btn => btn.classList.remove("active"));
			//btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
			
			var blueZeit = document.querySelector(".zeitBlueFilter");
			var answer = selectedFilterDiv.contains(blueZeit); 
			var blueFilterBlock;
			if (answer == true) {
				var zeitChildLi = selectedFilterDiv.getElementsByTagName('li')[2];
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(3)">X</div>`;
				blueFilterBlock.classList.add('zeitBlueFilter');
				blueFilterBlock.classList.add('filter');
				selectedFilterDiv.replaceChild(blueFilterBlock, zeitChildLi);
			} else {
				blueFilterBlock = document.createElement('li');
				blueFilterBlock.innerHTML += `${element.innerHTML} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(3)">X</div>`;
				blueFilterBlock.classList.add('zeitBlueFilter');
				blueFilterBlock.classList.add('filter');
				//if (selectedFilterDiv.children.length == 3) {
				//	console.log("in the first if", selectedFilterDiv.children.length)
				//	selectedFilterDiv.insertBefore(blueFilterBlock, selectedFilterDiv.lastElementChild);
				//} else {
				//	console.log("in the second if blue zeit", selectedFilterDiv.children.length)
				selectedFilterDiv.appendChild(blueFilterBlock);
				//}
				
			} 
			
			this.addEventListener("click", toggleAction(this, 3))
			//this.classList.add("active");
		}
	});
});

function blueThemaActive(c, button = undefined) {
	//console.log("in the blue thema button", button);
	//console.log("in the blue thema c", c);
	
	if (initialState.userTypeValue == 0) {
			//console.log("in the button thema clicked", element);
			document.getElementById("ichBin").classList.toggle("shake");
		} else if (c != null && c.length != 0 && button != undefined) {
			
			if (tags.some((tag) => tag == c)) {
				document.getElementById("ichBin").classList.remove("shake");
				//btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
				//button.classList.add("active");
				//console.log('thiiiiiiiiiiiiiis', this);
				//console.log('buttoooooooon', button);
				button.addEventListener("click", toggleAction(button, 2))
				
				var blueDatum = document.querySelector(".datumBlueFilter");
				var answer = selectedFilterDiv.contains(blueDatum); 
				var blueFilterBlock;
				if (answer == true) {
					var datumChildLi = selectedFilterDiv.getElementsByTagName('li')[1];
					blueFilterBlock = document.createElement('li');
					blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(2)">X</div>`;
					blueFilterBlock.classList.add('datumBlueFilter');
					blueFilterBlock.classList.add('filter');
					selectedFilterDiv.replaceChild(blueFilterBlock, datumChildLi);
				} else {
					blueFilterBlock = document.createElement('li');
					blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(2)">X</div>`;
					blueFilterBlock.classList.add('datumBlueFilter');
					blueFilterBlock.classList.add('filter');
					//if (selectedFilterDiv.children.length == 2) {
					//	console.log('the if length 2 in the blue active datum');
					//	console.log("in the first if", selectedFilterDiv.children.length)
					//	selectedFilterDiv.insertBefore(blueFilterBlock, selectedFilterDiv.lastElementChild);
					//} else {
					//	console.log('the else in the blue active datum');
					//	console.log("in the second if", selectedFilterDiv.children.length)
						selectedFilterDiv.appendChild(blueFilterBlock);
					//}
					
				} 
			} else {
				document.getElementById("ichBin").classList.remove("shake");
				//btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
				//button.classList.add("active");
				button.addEventListener("click", toggleAction(button, 4))
				
				var blueThema = document.querySelector(".themaBlueFilter");
				var answer = selectedFilterDiv.contains(blueThema);
				var blueFilterBlock;
				if (answer == true) {
					//console.log("in the blueThema true")
					var themaChildLi = selectedFilterDiv.getElementsByTagName('li')[3];
					blueFilterBlock = document.createElement('li');
					blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(4)">X</div>`;
					blueFilterBlock.classList.add('themaBlueFilter');
					blueFilterBlock.classList.add('filter');
					selectedFilterDiv.replaceChild(blueFilterBlock, themaChildLi);
				} else {
					blueFilterBlock = document.createElement('li');
					blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(4)">X</div>`;
					blueFilterBlock.classList.add('themaBlueFilter');
					blueFilterBlock.classList.add('filter');
					selectedFilterDiv.appendChild(blueFilterBlock);
				}
				
			}
		}
}

function toggleAction(button, num) {
	if (button.classList.contains("toggleFilter")) {
			//console.log('trueeee', button, num);
			//button.classList.remove("active");
			if (num == 2) {
				btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
				btnContainerTwo.querySelectorAll("button")  .forEach(btn => btn.classList.remove("active"));
			} else if (num == 3) {
				btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerThree.forEach(btn => btn.classList.remove("active"));
			} else if (num == 4) {
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
			}
			removeFilter(num);
		} else {
			//console.log('neeein', button, num);
			if (num == 2) {
				btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
				btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
			} else if (num == 3) {
				btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerThree.forEach(btn => btn.classList.remove("active"));
			} else if (num == 4) {
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
			}
			button.classList.add("toggleFilter");
			button.classList.add("active");
		}
} 

function removeFilter(num) {
	console.log('in the remove', num)
	console.log(selectedFilterDiv.children.length)
	console.log('childreeen', selectedFilterDiv)
	errorContainer.innerHTML = "";
	
	if (num == 1 ){
		selectedFilterDiv.removeChild(selectedFilterDiv.firstElementChild);
		btnContainerOne.forEach(btn => {
			btn.classList.remove("active");
			btn.style.display = "block";
		});
		initialState.userTypeValue = 0;
		
		document.getElementById("selectedFilters").classList.add("grey");
		document.getElementById("warenkorb").classList.add("grey");
		document.getElementById("filterBtnContainerDATUM").classList.add("grey");
		document.getElementById("filterBtnContainerZEIT").classList.add("grey");
		document.getElementById("filterBtnContainerTHEMA").classList.add("grey");
		document.querySelector(".display").classList.add("grey");
		
		//btnContainerThree.forEach(btn => btn.classList.remove("active"));
		//btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		btnContainerTwo.querySelectorAll("button").forEach((element) => element.classList.remove("btnHover"));
		btnContainerThree.forEach((element) => element.classList.remove("btnHover"));
		btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("btnHover"));
		document.querySelector(".userMenuDiv").innerHTML =  "";
	} else if ( num == 2) {
		currentDatum = null;
		currentZeit = null;
		console.log('in the if 2')
		//selectedFilterDiv.children[1].remove();
		console.log(document.querySelector(".datumBlueFilter"));
		
		if (selectedFilterDiv.children.length == 2) {
			console.log('in the if num 2');
			console.log(selectedFilterDiv.children.length);
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
			//document.getElementById("selectedFilters").removeChild(document.getElementById("selectedFilters").lastElementChild);
			console.log(selectedFilterDiv.children.length);
		} else if (selectedFilterDiv.children.length == 3) {
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		}
		btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
		btnContainerThree.forEach(btn => btn.classList.remove("active"));
		btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		document.getElementById("selectedFilters").querySelectorAll("li").forEach(li => console.log("li", li));
		titleShowAll();
		selectedFilterDiv.innerHTML.reload();
		//selectedFilterDiv.innerHTML = "hola";
		//selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
		//datumFlag = 1;
		
	} else if ( num == 3) {
		currentZeit = null;
		//selectedFilterDiv.children[2].remove();
		if (selectedFilterDiv.children.length == 3) selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		btnContainerThree.forEach(btn => btn.classList.remove("active"));
		btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		filterDatum(dayName);
		//datumFlag = 1;
		
	} else if ( num == 4) {
		selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
		//selectedFilterDiv.children[3].remove();
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		filterTimeSlot(selectedFilterDiv.children[2].textContent.split(" ")[0].toLowerCase());
		selectedFilterDiv.innerHTML.reload();
	} 
	
	if (selectedFilterDiv.children.length == 1) {
		titleShowAll();
		//document.getElementById('all').click();
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
		document.getElementById("ichBin").classList.toggle("shake");
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
					<p class="popUpTittle">SIE SIND BEREITS AUGEMELDET FRÜHER</p>
					<table class="popUpTable"> 					
						<tr><td style="width: 50%;">${currentCartItem.short_name} <br> ${currentCartItem.official_title.split(":")[0]}</td> <td style="text-align: right; padding-right: 40px">${currentCartItem.neues_datum}</td> <td class="popUpImg"><div><img src="/assets/lifefair/images/minus.png" style="width:12px; "/></div></td></tr> 				
					</table>
					<p class="popUpText">MÖCHTEN SIE UMBUCHEN AUF:</p> 
					<table class="popUpTable"> 					
						<tr> <td style="width: 50%;">${blocks[i].short_name} <br> ${blocks[i].official_title.split(":")[0]}</td> <td style="text-align: right; padding-right: 40px">${blocks[i].neues_datum}</td> <td class="popUpImg"><div><img src="/assets/lifefair/images/plus.png" style="width:12px; " /></div></td></tr>
					</table>
					<div class="popUpBtnDiv"> 
						<button class="popUpCancel" onclick="popUpCancel()">ABBRECHEN</button> <button class="popUpConfirm" onclick="popUpConfirm(${i})">UMBUCHEN</button> 
					</div>
				</div>
			</div> `;	
	popUpDiv.style.display = "block";
	console.log("the same day is not possible" );
}

function popUpConfirm(i) {
	popUpDiv.style.display = "none";
	var index = initialState.cart.findIndex(item => item.neues_datum == blocks[i].neues_datum);
	//console.log("the indeeex of iteem", index);
	
	initialState.cart[index] = blocks[i];
	updateCart();

	//console.log("in the popUp confirm", blocks[i]);
}

function popUpCancel() {
	popUpDiv.style.display = "none";
	console.log("in the popUp cancel");
}

function updateCart() {
	updateItems();
	updateTotal();

	localStorage.setItem("CART", JSON.stringify(initialState.cart));
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
		cartElement.innerHTML = "<p class='cartLeer'>IHR WARENKORB IST MOMENTAN LEER</p>";
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
	window.open("http://localhost:8000/tickets?anlass=SGES 2021", "_self");
/*
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
	*/

}

function checkOut() {
	
	if (initialState.userTypeValue == 0) {
		document.getElementById("ichBin").classList.toggle("shake");
	} else if (initialState.cart.length == 0) {
		var shaketext = document.querySelector(".cartLeer")
			shaketext.classList.add("shake");
		} else {
			inTheChekout = true;
			document.getElementById("step0").style.display = "none";
			document.getElementById("step1").style.display = "block"
			document.querySelector(".positionFixed").style.display = "block";
			cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT BESTELLEN</p>`
		}
}

//Watching over the rechnungAdresse checkbox in the checkout 
var rechnungAdresse = document.getElementById("gleiche");
rechnungAdresse.checked = false;
rechnungAdresse.addEventListener('change', function(e){
	if (rechnungAdresse.checked) {
		console.log("Gleiche check");
		document.getElementById("step2").style.display = "block";
		initialState.rechCheck = "Yes";
		localStorage.setItem("RECHCHECK", JSON.stringify(initialState.rechCheck));
	} else if (!rechnungAdresse.checked) {
		console.log("not Gleiche check");
		document.getElementById("step2").style.display = "none";
		initialState.rechCheck = "No";
		localStorage.setItem("RECHCHECK", JSON.stringify(initialState.rechCheck));
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
	
	var herrFrau = document.getElementById("inputHerrFrau").value;
	var akademishTitle = document.getElementById("inputTitle").value;
	var lastname = document.getElementById("inputSurname").value;
	var firstname = document.getElementById("inputFirstname").value;
	var firma = document.getElementById("inputFirma").value;
	var funktion = document.getElementById("inputFunktion").value;
	var phone = document.getElementById("inputPhone").value;
    var email = document.getElementById("inputEmail").value;  
    var adresse = document.getElementById("inputAdresse").value;
    var plzOrt = document.getElementById("inputOrt").value;
    
    console.log(lastname, firstname, firma, funktion, phone, email, adresse, plzOrt);
    
    if (!herrFrau) {
        document.getElementById("inputHerrFrau").style.border = "1px solid red;"
        document.getElementById("inputHerrFrau").focus();
    } else if (!akademishTitle) {
        document.getElementById("inputTitle").style.border = "1px solid red;"
        document.getElementById("inputTitle").focus();
    } else if (!lastname) {
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
		rechnungAdresseChecked(herrFrau, akademishTitle, firstname, lastname, adresse, email, phone, firma, funktion, plzOrt);
	} else {
		
		initialState.cartTwo = initialState.cart;
		localStorage.setItem("CARTTWO", JSON.stringify(initialState.cartTwo));
		initialState.addressOne.push(herrFrau, akademishTitle, firstname, lastname, adresse, email, phone, firma, funktion, plzOrt);
		localStorage.setItem("ADDRESSONE", JSON.stringify(initialState.addressOne));
		
		frappe.call({
			'method': 'lifefair.lifefair.tickets.create_ticket',
			'args': {
				'rechAdress': "No",
				'herrFrau': herrFrau,
				'akademishTitle': akademishTitle,
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
				if (rechnung.checked) {
					window.open("http://localhost:8000/tickets?anlass=ticketkauf", "_self");
					console.log("in the create ticket callback")
				} else { 
					openStripe();
				}
			}
		});
	}
}

//Cheking the Values of Rechnung Adresse if checked
function rechnungAdresseChecked(herrFrau, akademishTitle, firstname, lastname, adresse, email, phone, firma, funktion, plzOrt) {
	console.log("rechnungAdresseChecked");
	
	var herrFrauTwo = document.getElementById("inputHerrFrauTwo").value;
	var lastnameTwo = document.getElementById("inputSurnameTwo").value;
	var firstnameTwo = document.getElementById("inputFirstnameTwo").value;
	var firmaTwo = document.getElementById("inputFirmaTwo").value;
	var funktionTwo = document.getElementById("inputFunktion").value;
	var phoneTwo = document.getElementById("inputPhoneTwo").value;
    var emailTwo = document.getElementById("inputEmailTwo").value;  
    var adresseTwo = document.getElementById("inputAdresseTwo").value;
    var plzOrtTwo = document.getElementById("inputOrtTwo").value;
    
    console.log(lastnameTwo, firstnameTwo, firmaTwo, phoneTwo, emailTwo, adresseTwo, plzOrtTwo);
    
    if (!herrFrauTwo) {
        document.getElementById("inputHerrFrauTwo").style.border = "1px solid red;"
        document.getElementById("inputHerrFrauTwo").focus();
    } else if (!lastnameTwo) {
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
    }  else if (!phoneTwo) {
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
		
		initialState.cartTwo = initialState.cart;
		localStorage.setItem("CARTTWO", JSON.stringify(initialState.cartTwo));
		initialState.addressOne.push(herrFrau, akademishTitle, firstname, lastname, adresse, email, phone, firma, funktion, plzOrt);
		localStorage.setItem("ADDRESSONE", JSON.stringify(initialState.addressOne));
		initialState.addressTwo.push(herrFrauTwo, firstnameTwo, lastnameTwo, adresseTwo, emailTwo, phoneTwo, firmaTwo, funktionTwo, plzOrtTwo);
		localStorage.setItem("ADDRESSTWO", JSON.stringify(initialState.addressTwo));

		frappe.call({
			'method': 'lifefair.lifefair.tickets.create_ticket',
			'args': {
				'rechAdress': "Yes",
				'herrFrau': herrFrau,
				'akademishTitle': akademishTitle,
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
			}
		});
		
		frappe.call({
			'method': 'lifefair.lifefair.tickets.create_invoice',
			'args': {
				'salutation': herrFrauTwo,
				'last_name': lastnameTwo, 
				'first_name': firstnameTwo,
				'company': firmaTwo,
				'function': funktionTwo,
				'phone': phoneTwo,
				'email': emailTwo,  
				'street': adresseTwo, 
				'pincode': plzOrtTwo,
				'cart': initialState.cart 
			},
			'callback': function(response) {
				var registrationen = response.message;
				if (rechnung.checked) {
					window.open("http://localhost:8000/tickets?anlass=ticketkauf", "_self");
					console.log("in the invoice callback");
				} else { 
					openStripe();
				}
				
				//var payment = response.message;
			}
		});
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
				var dayForCard = new Date(block.neues_datum);
				var dayNameForCard = dayForCard.toLocaleString('de-ch', {weekday: 'long'});
				
				if (block.neues_datum !== currentDate) {
					currentDate = block.neues_datum;
				
					var dateTitle = document.createElement('div');
					var date = block.neues_datum.split("-").reverse().join(".");
					var day = new Date(currentDate);
					dayName = day.toLocaleString('de-ch', {weekday: 'long'});
					
					dateTitle.innerHTML += `<div style="display: none" id="vormittag_${block.neues_datum}_${dayName}" class='localTitle_vormittag'><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'>${dayName}</td><td class='dateNum'> ${date}</td> <td class='timeName'>VORMITTAG</td> </tr> </table></div>`;
					dateTitle.innerHTML += `<div style="display: none" id="nachmittag_${block.neues_datum}_${dayName}" class='localTitle_nachmittag'><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'>${dayName}</td><td class='dateNum'> ${date}</td>  <td class='timeName'>NACHMITTAG</td> </tr> </table></div>`;
					dateTitle.innerHTML += `<div style="display: none" id="abend_${block.neues_datum}_${dayName}" class='localTitle_abend'><table> <tr> <td class='ticketsName'>TICKETS</td> <td class='dateName'>${dayName}</td><td class='dateNum'> ${date}</td>  <td class='timeName'>ABEND</td> </tr> </table></div>`;
					blocksContainer.appendChild(dateTitle);
					
					var datumBtn = document.getElementById("filterBtnContainerDATUM");
					datumBtn.innerHTML += `<button class="btn widthBtn" onclick="filterDatum('${dayName}', this)">${dayName}</button>`
					
				}
				
				addClass(card, dayNameForCard);
				card.innerHTML += `<div class='blockContainer'> <div class='blockTime'>  <div> ${block.short_name} </div><div> ${block.time}</div> </div> <p class='blockTitle'>  ${block.official_title} </p> <p class='blockText'>  ${block.location} </p><div>`;
				card.innerHTML += `<div class='buttonsContainer'> <a href="${block.website_link}" target="_blank" class='info'><img class='infoImg' src="/assets/lifefair/images/info.png"/></a> <div class='cart' onclick="addToCart(${x})"><img class='cartImg' src="/assets/lifefair/images/cart.png"/></div> </div>`;
				
				//creating the filter thema buttons and adding the class to the card
				var blockInterest = block.interests.split(",");
				blockInterest.forEach(function (int) {
					addClass(card, int);
					if (interests.indexOf(int) == -1) { 
						interests.push(int);
						var themBtn = document.getElementById("filterBtnContainerTHEMA");
						themBtn.innerHTML += `<button class="btn" onclick="filterSelection('${int}', this)">${int}</button>`
					}
				});
				
				if (block.time) {
					var twoTimeRange = block.time.split("und");
					
					if (twoTimeRange.length > 1) {
						for (var i = 0; i < twoTimeRange.length; i++ ) {
							
							var OnetimeRange = twoTimeRange[i].split("-");
							var timeFilter = checkTime(OnetimeRange);

							  for (var j = 0; j < timeFilter.length; j++ ) {
								  if (timeFilter[j] == 1) {
									  card.classList.add('vormittag');
									  //console.log('card 1', card)
										document.getElementById(`vormittag_${block.neues_datum}_${dayName}`).appendChild(card);
										//console.log('card vomittag', document.getElementById(`vormittag_${block.neues_datum}_${dayName}`))
									  } else if ( timeFilter[j] == 2){
										  card.classList.add('nachmittag');
										  //console.log('card 2', card)
										  var cloneCard = card.cloneNode(true);
										  document.getElementById(`nachmittag_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
										  //console.log('card nachmittag', document.getElementById(`nachmittag_${block.neues_datum}_${dayName}`))
										  } else {
											  card.classList.add('abend');
											  var cloneCard = card.cloneNode(true);
											  //cloneCard.classList.add(...`${card.className}`)
											  document.getElementById(`abend_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
											  }
								  }
							}
						} else {
							
							var OnetimeRange = block.time.split("-");
							var timeFilter = checkTime(OnetimeRange);
							//console.log('OnetimeRange 2', OnetimeRange)
							  for (var i = 0; i < timeFilter.length; i++ ) {
								  if (timeFilter[i] == 1) {
									  card.classList.add('vormittag');
									  document.getElementById(`vormittag_${block.neues_datum}_${dayName}`).appendChild(card);
									  } else if ( timeFilter[i] == 2){
										  card.classList.add('nachmittag');
										  var cloneCard = card.cloneNode(true);
										  //cloneCard.classList.add(...`${card.className}`)
										  document.getElementById(`nachmittag_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
										  } else {
											  card.classList.add('abend');
											  var cloneCard = card.cloneNode(true);
											  //cloneCard.classList.add(...`${card.className}`)
											  document.getElementById(`abend_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
											  }
								  }
							
							}
					  
				  } 
			});
			//console.log("all block interes", interests);
			
			for (var i = 0; i < blocks.length; i++ ) {
				if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`) != null) {
					if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).querySelector(".blockContainer") == null) {
					document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).remove();
						
					}
				}
				if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`) != null) {
					if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).querySelector(".blockContainer") == null) {
						document.getElementById(`nachmittag_${blocks[i].neues_datum}_${dayName}`).remove();
					}
				} 
				if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`) != null) {
					if (document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).querySelector(".blockContainer") == null) {
						document.getElementById(`abend_${blocks[i].neues_datum}_${dayName}`).remove();
					}
				}
			};
		}
	});
	
}

function nachbestellenBtn() {
	document.getElementById("step3").style.display = "none";
	document.getElementById("step0").style.display = "none";
	
	inTheChekout = true;
	window.localStorage.removeItem("ADDRESSONE");
	initialState.addressOne = [];
	
	document.getElementById("step1").style.display = "block";
	document.querySelector(".positionFixed").style.display = "block";
	document.getElementById("warenkorb").style.display = "block";
	document.getElementById("warenkorb").classList.remove("grey");
	cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT BESTELLEN</p>`;
	
	initialState.cart = initialState.cartTwo;
	console.log("initialState.cart", initialState.cart);
	updateCart();
	
	if ( initialState.rechCheck == "Yes" ) {
		
		document.getElementById("gleiche").checked = true;
		document.getElementById("step2").style.display = "block";
		
		var herrFrauTwo = document.getElementById("inputHerrFrauTwo");
		var lastnameTwo = document.getElementById("inputSurnameTwo");
		var firstnameTwo = document.getElementById("inputFirstnameTwo");
		var firmaTwo = document.getElementById("inputFirmaTwo");
		var funktionTwo = document.getElementById("inputFunktion");
		var phoneTwo = document.getElementById("inputPhoneTwo");
		var emailTwo = document.getElementById("inputEmailTwo");  
		var adresseTwo = document.getElementById("inputAdresseTwo");
		var plzOrtTwo = document.getElementById("inputOrtTwo");
		
		for (var i = 0; i < initialState.addressTwo.length; i++ ) {
			console.log("initialState.cart", initialState.cart);

			herrFrauTwo.value = initialState.addressTwo[0];
			lastnameTwo.value = initialState.addressTwo[1];
			firstnameTwo.value = initialState.addressTwo[2];
			adresseTwo.value = initialState.addressTwo[3];
			emailTwo.value = initialState.addressTwo[4];
			phoneTwo.value = initialState.addressTwo[5];
			firmaTwo.value = initialState.addressTwo[6];
			funktionTwo.value = initialState.addressTwo[7];
			plzOrtTwo.value = initialState.addressTwo[8];
		}
	}
	
}

function zuruckZurSeite() {
	window.localStorage.clear();
	window.open("https://sges.ch/", "_self");
}

function loadEndMsg() {
	
	document.getElementById("step0").style.display = "none";
	document.getElementById("warenkorb").style.display = "none";
	document.getElementById("step1").style.display = "none";
	document.querySelector(".positionFixed").style.display = "none";
	document.getElementById("step3").style.display = "block";
	
	frappe.call({
		'method': "lifefair.lifefair.tickets.get_person",
		'callback': function (response) {
			person = response.message;
			console.log('the person', person[0]);
			
			var endMsgContainer = document.getElementById("step3");
			
			for (var i = 0; i < initialState.addressOne.length; i++ ) { 

				//console.log("items in local adress one storage", initialState.addressOne[i], i);
				endMsgContainer.innerHTML = `
						<h1 class="endMsgTitle">TICKETKAUF ERFOLGREICH</h1>
						<p class="endMsgTextOne"> Herzlichen Dank ${initialState.addressOne[0]} ${initialState.addressOne[1]} ${initialState.addressOne[2]} ${initialState.addressOne[3]} für Ihren Ticketkauf. Ihr Ticket Nr.${person[0].name}  wird Ihnen per E-mail an ${initialState.addressOne[5]} zugestellt.</p>
						<div class="infoDiv"><div class="infoI">i</div> <table><tr><td class="innerInfoDiv">Übernachtung empfohlen</td></tr> <tr><td class="innerInfoDiv"> <a href="https://www.hyatt.com/en-US/hotel/switzerland/park-hyatt-zurich/zurph?src=corp_lclb_gmb_seo_zurph" target="_blank" class="hotelLink"> PARKHOTEL-LINK </a></td></tr></table></div>
					`;
			}
			// To know the day and time of the blocks and with this if the Lunch or Aperol is included
			for (var x = 0; x < initialState.cartTwo.length; x++ ) {
				var infoDayName = null;
				var daytConvert = new Date(initialState.cartTwo[x].neues_datum);
				var infoDayFlag = daytConvert.toLocaleString('de-ch', {weekday: 'long'});
				if ( infoDayName != infoDayFlag ) {
					infoDayName = infoDayFlag;
				}
				
				var twoTimeRange = initialState.cartTwo[x].time.split("und");
				if (twoTimeRange.length > 1) {
					for (var i = 0; i < twoTimeRange.length; i++ ) {
						var OnetimeRange = twoTimeRange[i].split("-");
						var timeFilter = checkTime(OnetimeRange);
						if (timeFilter[0] == 1) {
							initialState.info.push("Networking-Lunch und Aperol inklusiv am " + infoDayName);
						} else if ( timeFilter[1] == 2){
								initialState.info.push("Networking-Lunch und Aperol inklusiv am " + infoDayName);
						} else {
							initialState.info.push(" ");
						}
					}
				} else {
					var OnetimeRange = initialState.cartTwo[x].time.split("-");
					var timeFilter = checkTime(OnetimeRange);
					console.log("timeFilter 2", timeFilter)
					if (timeFilter[0] == 1) {
						initialState.info.push("Networking-Lunch inklusiv am " + infoDayName);
					} else if ( timeFilter[0] == 2){
						initialState.info.push("Networking-Aperol inklusiv am " + infoDayName);
					} else {
						initialState.info.push(" ");
					}
				} 
					if (initialState.info[x] != " ") {
						endMsgContainer.innerHTML += `<div class="infoDiv"> <div class="innerInfoDiv" > <div class="infoDetails" >${initialState.info[x]} </div> </div></div>`;
				}
			}

			endMsgContainer.innerHTML += `
				<div class="endMsgButtonsContainer">
					<a href="/api/method/frappe.utils.print_format.download_pdf?doctype=Person&name=${person[0].name}&format=Standard&no_letterhead=0&_lang=en" class="endMsgBtn downloadBtn" download>TICKET / RECHNUNG HERUNTERLADEN</a>
					<button class="endMsgBtn nachbestellenBtn" onclick="nachbestellenBtn()">TICKETS NACHBESTELLEN</button>
					<button class="endMsgBtn zuruckBtnTwo" onclick="zuruckZurSeite()">ZURÜCK ZUR STARTSEITE</button>   
				</div>
				<p class="endMsgTextTwo"> Wir freuen uns, Sie bald am Swiss Green Economy Symposium begrüssen zu dürfen.</p>
				`
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
		cartElement.innerHTML = "<p class='cartLeer'>IHR WARENKORB IST MOMENTAN LEER</p>";
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
			// When the payment goes through with Stripe, it calls this endpoint
			if (args['anlass'] == 'ticketkauf') {
				loadEndMsg();
			} else {
				//console.log('args with anlass', args['anlass'] )
				loadBlocks(args['anlass']);
			}
		}
    } 
}
