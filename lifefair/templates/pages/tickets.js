var anlass;
var blocks;
var interests = [];
var itemVal;
var dayName;
var currentDatum = null;
var currentTimeSlot = "all";
var currentZeit = null;
var currentThema = null;
var rechAdd = "notDone";
//var datumFlag = 0;
var inTheChekout = false;
var userDefined = "No"
var initialState = {
	meeting: JSON.parse(localStorage.getItem("MEETING")) || "",
	userTypeValue : JSON.parse(localStorage.getItem("USER")) || "Student",
	cart : JSON.parse(localStorage.getItem("CART")) || [],
	total: JSON.parse(localStorage.getItem("TOTAL")) || 0,
	//cartTwo: JSON.parse(localStorage.getItem("CARTTWO")) || [],
	addressOne: JSON.parse(localStorage.getItem("ADDRESSONE")) || [],
	addressTwo: JSON.parse(localStorage.getItem("ADDRESSTWO")) || [],
	info: JSON.parse(localStorage.getItem("INFO")) || [],
	rechCheck: JSON.parse(localStorage.getItem("RECHCHECK")) || "No",
	stripe: JSON.parse(localStorage.getItem("STRIPE")) || "No",
	ticketNum: JSON.parse(localStorage.getItem("TICKETS")) || null,
	sinv: JSON.parse(localStorage.getItem("SINV")) || null,
};
var tags = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag" ];
var datumBtn = document.getElementById("filterBtnContainerDATUM");
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

function userSelection(c) {
	userDefined = "Yes";
	var currentUser;
	initialState.userTypeValue = c;
	localStorage.setItem("USER", JSON.stringify(initialState.userTypeValue));
	
	if ( currentUser != initialState.userTypeValue ) {
		currentUSer = initialState.userTypeValue;

		loadBlocks(anlass)
		datumBtn.innerHTML = `<h2 class="filterTitle" id="datum">DATUM</h2>`;
		selectedFilterDiv.innerHTML = '';
		initialState.cart = [];
		localStorage.setItem("CART", JSON.stringify(initialState.cart));
	}
	
	document.getElementById("ichBin").classList.remove("shake");
	document.getElementById("filterBtnContainerDATUM").classList.remove("grey");
	document.getElementById("filterBtnContainerZEIT").classList.remove("grey");
	document.getElementById("filterBtnContainerTHEMA").classList.remove("grey");
	document.getElementById("warenkorb").classList.remove("grey");
	document.querySelector(".display").classList.remove("grey");
	btnContainerTwo.querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	btnContainerThree.forEach((element) => element.classList.add("btnHover"));
	btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.add("btnHover"));
	btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
	btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
	btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
	btnContainerThree.forEach(btn => btn.classList.remove("active"));
	btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
	btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))

	var userMenu = document.getElementById("userMenu");
	var userMenuDiv = document.createElement('div');
	userMenuDiv.classList.add('userMenuDiv');
	userMenuDiv.innerHTML = `<div class="userMenuClass" onclick="openDropdown()"><p>${c}</p> <img class='dropdownImg' src="/assets/lifefair/images/arrow.png"/ style="padding-top: 5px;"></div>`;
	userMenu.insertBefore(userMenuDiv, userMenu.firstChild)
    document.getElementById("dropdown").querySelectorAll("button").forEach((element) => element.style.display = "none");
    
	if ( document.getElementById("selectedFilters").contains(document.querySelector(".grey")) == true) document.getElementById("selectedFilters").classList.remove("grey");
	updateCart();
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

	if (userDefined == "No") {
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
	if (userDefined == "No") {
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
	//console.log("in the tittle fuuunc")
	var localTitle;
	currentTimeSlot = "all";
	
	localTitle = document.querySelectorAll('.localTitle_vormittag');
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
	if (userDefined == "Yes") {

		if (dayName == "iAmNull" ) {
			localTitle = document.querySelectorAll('.localTitle_vormittag');
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
				} else {
					if (currentTimeSlot == "vormittag" || currentTimeSlot == "all") {
						flag = 1;
						document.getElementById(`vormittag_${blocks[i].neues_datum}_${dayName}`).style.display = "block";
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
}

function cardFilter(c) {
	var flag = 0;
	//Show all cards
	var localTitle = document.querySelectorAll('.filterDiv');
	for ( var j = 0; j < localTitle.length; j++ ) {
		localTitle[j].style.display = "none";
	}
	if (c != "" && c != null) {
		
		if ( currentTimeSlot == "vormittag" ) {
			var vormittagCards = document.querySelectorAll('.filterDiv');
			for (var i = 0; i < vormittagCards.length - 1; i++ ) {
				
				if ( vormittagCards[i].classList.contains(`${dayName}`) == false || vormittagCards[i].classList.contains(`${c}`) == false || vormittagCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
					vormittagCards[i].style.display = "none";
				} else {
						flag = 1;
						vormittagCards[i].style.display = "block";
						titleFilter(dayName)
				}
			}
		}
		if ( currentTimeSlot == "nachmittag" ) {
			var nachmittagCards = document.querySelectorAll('.filterDiv');
			for (var i = 0; i < nachmittagCards.length - 1; i++ ) {
				
				if ( nachmittagCards[i].classList.contains(`${dayName}`) == false || nachmittagCards[i].classList.contains(`${c}`) == false || nachmittagCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
					nachmittagCards[i].style.display = "none";
				} else {
						flag = 1;
						nachmittagCards[i].style.display = "block";
						titleFilter(dayName)
				}
			}
		}
		if ( currentTimeSlot == "abend") {
			var abendCards = document.querySelectorAll('.filterDiv');
			for (var i = 0; i < abendCards.length - 1; i++ ) {
				
				if ( abendCards[i].classList.contains(`${dayName}`) == false || abendCards[i].classList.contains(`${c}`) == false || abendCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
					abendCards[i].style.display = "none";
				} else {
						flag = 1;
						abendCards[i].style.display = "block";
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
	currentTimeSlot = c;
	if (userDefined == "No") {
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
			localTitle[j].style.display = "block";
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
		if (userDefined == "No") {
			console.log("user missing");
		} else if (currentDatum == null) {
			console.log("datum missing");
		} else {
			document.getElementById("ichBin").classList.remove("shake");
			
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
				selectedFilterDiv.appendChild(blueFilterBlock);
			} 
			
			this.addEventListener("click", toggleAction(this, 3))
		}
	});
});

function blueThemaActive(c, button = undefined) {
	//console.log("in the blue thema c", c);
	
	if (userDefined == "No") {
		document.getElementById("ichBin").classList.toggle("shake");
	} else if (c != null && c.length != 0 && button != undefined) {

		if (tags.some((tag) => tag == c)) {
			document.getElementById("ichBin").classList.remove("shake");
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
				selectedFilterDiv.appendChild(blueFilterBlock);
			} 
		} else {
			document.getElementById("ichBin").classList.remove("shake");
			button.addEventListener("click", toggleAction(button, 4))
			
			var blueThema = document.querySelector(".themaBlueFilter");
			var answer = selectedFilterDiv.contains(blueThema);
			var blueFilterBlock;
			if (answer == true) {
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
			if (num == 2) {
				btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerTwo.querySelectorAll("button")  .forEach(btn => btn.classList.remove("active"));
			} else if (num == 3) {
				btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerThree.forEach(btn => btn.classList.remove("active"));
			} else if (num == 4) {
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
			}
			removeFilter(num);
		} else {
			if (num == 2) {
				btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
			} else if (num == 3) {
				btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerThree.forEach(btn => btn.classList.remove("active"));
			} else if (num == 4) {
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
				btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
			}
			button.classList.add("toggleFilter");
			button.classList.add("active");
		}
} 

function removeFilter(num) {
	//console.log('in the remove', num);
	errorContainer.innerHTML = "";
	
	if (num == 1 ){
		selectedFilterDiv.removeChild(selectedFilterDiv.firstElementChild);
		btnContainerOne.forEach(btn => {
			btn.classList.remove("active");
			btn.style.display = "block";
		});
		userDefined = "No";
		
		document.getElementById("selectedFilters").classList.add("grey");
		document.getElementById("warenkorb").classList.add("grey");
		document.getElementById("filterBtnContainerDATUM").classList.add("grey");
		document.getElementById("filterBtnContainerZEIT").classList.add("grey");
		document.getElementById("filterBtnContainerTHEMA").classList.add("grey");
		document.querySelector(".display").classList.add("grey");
		btnContainerTwo.querySelectorAll("button").forEach((element) => element.classList.remove("btnHover"));
		btnContainerThree.forEach((element) => element.classList.remove("btnHover"));
		btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("btnHover"));
		document.querySelector(".userMenuDiv").innerHTML =  "";
	} else if ( num == 2) {
		currentDatum = null;
		currentZeit = null;
		
		if (selectedFilterDiv.children.length == 2) {
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
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

	} else if ( num == 3) {
		currentZeit = null;
		//selectedFilterDiv.children[2].remove();
		if (selectedFilterDiv.children.length == 3) selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		btnContainerThree.forEach(btn => btn.classList.remove("active"));
		btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		filterDatum(dayName);
		
	} else if ( num == 4) {
		selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
		//selectedFilterDiv.children[3].remove();
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		filterTimeSlot(selectedFilterDiv.children[2].textContent.split(" ")[0].toLowerCase());
		selectedFilterDiv.innerHTML.reload();
	} else if ( num == 5) {
		selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
		//selectedFilterDiv.children[3].remove();
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		filterTimeSlot(selectedFilterDiv.children[2].textContent.split(" ")[0].toLowerCase());
		selectedFilterDiv.innerHTML.reload();
	} 
	
	if (selectedFilterDiv.children.length == 1) {
		titleShowAll();
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
	if (userDefined == "No") {
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
}

function popUpConfirm(i) {
	popUpDiv.style.display = "none";
	var index = initialState.cart.findIndex(item => item.neues_datum == blocks[i].neues_datum);
	initialState.cart[index] = blocks[i];
	updateCart();
}

function popUpCancel() {
	popUpDiv.style.display = "none";
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
			totalPrice += item.rate ;
			cartTotal.innerHTML = `<div class="alleArtikel"><p></p></div> <div class="totalDisplay"><p>TOTAL</p> <p>${totalPrice.toFixed(2)}</p></div>`;	
			initialState.total = totalPrice;
			localStorage.setItem("TOTAL", JSON.stringify(initialState.total));
		});
	} else { 
		cartTotal.innerHTML = "" 
		initialState.total = 0;
		localStorage.setItem("TOTAL", JSON.stringify(initialState.total));
	}
}

function updateItems() {
	if ( initialState.cart.length > 0) {
		cartElement.innerHTML = ""; //Clearing the cart to avoid duplication
		initialState.cart.forEach((item, i) => {
			var cardText = item.official_title.split(":");
			itemVal = item.rate;
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
	if (userDefined == "No") {
		document.getElementById("ichBin").classList.toggle("shake");
	} else if (inTheChekout == true) {
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
	window.open(`/tickets?anlass=${anlass}`, "_self");
}

function checkOut() {
	
	if (userDefined == "No") {
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
		document.getElementById("step2").style.display = "block";
		initialState.rechCheck = "Yes";
		localStorage.setItem("RECHCHECK", JSON.stringify(initialState.rechCheck));
	} else if (!rechnungAdresse.checked) {
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

//Checking the GiftCard Code
function checkGiftCard(){
	var giftCard = document.getElementById("inputGutschein");
	frappe.call({
		'method': 'lifefair.lifefair.tickets.check_giftcode',
		'args': {
			'giftcode': giftCard.value
		},
		'callback': function(response) {
			var res = response.message;
			
			if (res == -1) {
				giftCard.value = "";
				giftCard.placeholder = "Ungültiger Code"; 
			} else {
				var discount = (res/100) * initialState.total;
				var newTotal = initialState.total - discount;
				initialState.total = newTotal;
				localStorage.setItem("TOTAL", JSON.stringify(initialState.total));
				cartTotal.innerHTML = `<div class="alleArtikel"><p>${res}% Ermässigung.</p><p class="discount">-${discount}</p></div> <div class="totalDisplay"><p>TOTAL</p> <p>${newTotal.toFixed(2)}</p></div>`;
			}
		}
	});
}

//Cheking the Values after proceeding to pay
function checkDataAndPay() {
	//console.log("in the pay func");
	
	if (initialState.rechCheck == "No") {
		initialState.addressTwo = [];
		localStorage.setItem("ADDRESSTWO", JSON.stringify(initialState.addressTwo));
	}
	
	var herrFrau = document.getElementById("inputHerrFrau");
	var akademishTitle = document.getElementById("inputTitle");
	var lastname = document.getElementById("inputSurname");
	var firstname = document.getElementById("inputFirstname");
	var firma = document.getElementById("inputFirma");
	var funktion = document.getElementById("inputFunktion");
	var phone = document.getElementById("inputPhone");
    var email = document.getElementById("inputEmail");  
    var adresse = document.getElementById("inputAdresse");
    var land = document.getElementById("inputLand");
    var plzOrt = document.getElementById("inputOrt");
    var giftCard = document.getElementById("inputGutschein");
    
    //console.log(lastname, firstname, firma, funktion, phone, email, adresse, plzOrt);
    //var inputsArr = [herrFrau, akademishTitle, lastname, firstname, funktion, phone, email, adresse, plzOrt]
    
    //~ if (inputsArr.some((input) => !input.value)) {
		//~ checkValueField(inputsArr)
	//~ } 
	
	if (!herrFrau.value) {
		herrFrau.style.border = "1px solid red;"
		herrFrau.focus();
	} else if (!lastname.value) {
		lastname.style.border = "1px solid red;"
		lastname.focus();
	} else if (!firstname.value) {
		firstname.style.border = "1px solid red;"
		firstname.focus();
	} else if (!funktion.value) {
		funktion.style.border = "1px solid red;"
		funktion.focus();
	}  else if (!phone.value) {
		phone.style.border = "1px solid red;"
		phone.focus();
	} else if (!email.value) {
		email.style.border = "1px solid red;"
		email.focus();
	} else if (!adresse.value) {
		adresse.style.border = "1px solid red;"
		adresse.focus();
	} else if (!land.value) {
		land.style.border = "1px solid red;"
		land.focus();
	} else if (!plzOrt.value) {
		plzOrt.style.border = "1px solid red;"
		plzOrt.focus();
	} else if ((rechnungAdresse.checked) && (rechAdd == "notDone")) {
		
		var herrFrauTwo = document.getElementById("inputHerrFrauTwo");
		var lastnameTwo = document.getElementById("inputSurnameTwo");
		var firstnameTwo = document.getElementById("inputFirstnameTwo");
		var firmaTwo = document.getElementById("inputFirmaTwo");
		var funktionTwo = document.getElementById("inputFunktionTwo");
		var phoneTwo = document.getElementById("inputPhoneTwo");
		var emailTwo = document.getElementById("inputEmailTwo");  
		var adresseTwo = document.getElementById("inputAdresseTwo");
		var landTwo = document.getElementById("inputLandTwo");
		var plzOrtTwo = document.getElementById("inputOrtTwo");
		
		//console.log(lastnameTwo, firstnameTwo, firmaTwo, phoneTwo, emailTwo, adresseTwo, plzOrtTwo)
		//var inputsArrTwo = [herrFrauTwo, lastnameTwo, firstnameTwo, firmaTwo, funktionTwo, phoneTwo, emailTwo, adresseTwo, plzOrtTwo];
		
		if (!herrFrauTwo.value) {
			herrFrauTwo.style.border = "1px solid red;"
			herrFrauTwo.focus();
		} else if (!lastnameTwo.value) {
			lastnameTwo.style.border = "1px solid red;"
			lastnameTwo.focus();
		} else if (!firstnameTwo.value) {
			firstnameTwo.style.border = "1px solid red;"
			firstnameTwo.focus();
		} else if (!firmaTwo.value) {
			firmaTwo.style.border = "1px solid red;"
			firmaTwo.focus();
		} else if (!funktionTwo.value) {
			funktionTwo.style.border = "1px solid red;"
			funktionTwo.focus();
		}  else if (!phoneTwo.value) {
			phoneTwo.style.border = "1px solid red;"
			phoneTwo.focus();
		} else if (!emailTwo.value) {
			emailTwo.style.border = "1px solid red;"
			emailTwo.focus();
		} else if (!adresseTwo.value) {
			adresseTwo.style.border = "1px solid red;"
			adresseTwo.focus();
		} else if (!landTwo.value) {
			landTwo.style.border = "1px solid red;"
			landTwo.focus();
		} else if (!plzOrtTwo.value) {
			plzOrtTwo.style.border = "1px solid red;"
			plzOrtTwo.focus();
		} else {
			
			var plzTwo = plzOrtTwo.value.split(" ")[0];
			var ortTwo = plzOrtTwo.value.split(" ").splice(1).join(" ");
			
			initialState.addressTwo = {
				'herrFrau': herrFrauTwo.value, 
				'firstname': firstnameTwo.value,
				'lastname': lastnameTwo.value, 
				'adresse': adresseTwo.value,
				'email': emailTwo.value,
				'phone': phoneTwo.value,
				'firma': firmaTwo.value,
				'funktion': funktionTwo.value,
				'land': landTwo.value,
				'plz': plzTwo,
				'ort': ortTwo
			}
			localStorage.setItem("ADDRESSTWO", JSON.stringify(initialState.addressTwo));
			rechAdd = "done";
			checkDataAndPay();
		}
		
	} else {
		
		var plz = plzOrt.value.split(" ")[0];
		var ort = plzOrt.value.split(" ").splice(1).join(" ");

		initialState.addressOne = {
				'herrFrau': herrFrau.value,
				'akademishTitle': akademishTitle.value,
				'firstname': firstname.value,
				'lastname': lastname.value, 
				'adresse': adresse.value,
				'email': email.value,
				'phone': phone.value,
				'firma': firma.value,
				'funktion': funktion.value,
				'land': land.value,
				'plz': plz,
				'ort': ort,
				'giftcode': giftCard.value
		}
		localStorage.setItem("ADDRESSONE", JSON.stringify(initialState.addressOne));

		if (rechnung.checked) {
			createTicket();
		} else { 
			window.open("https://buy.stripe.com/test_14k8Az0qtbPC8KseUW", "_self");
			//~ openStripe();
		}
	}
}

function createTicket() {
	//console.log("in the caaaaalll")
	frappe.call({
			'method': 'lifefair.lifefair.tickets.create_ticket',
			'args': {
				'stripe': initialState.stripe,
				'addressOne': initialState.addressOne,
				'addressTwo': initialState.addressTwo,
				'warenkorb': initialState.cart,
				'total': initialState.total
			},
			'callback': function(response) {
				var res = response.message;

				initialState.ticketNum = (res.ticket_number);
				localStorage.setItem("TICKETS", JSON.stringify(initialState.ticketNum));
				
				initialState.sinv = (res.sinv_name);
				localStorage.setItem("SINV", JSON.stringify(initialState.sinv));
				anlass = "ticketkauf"
				window.open(`/tickets?anlass=${anlass}`, "_self"); 
			}
		});
}

//~ function checkValueField(arr) {
	//~ arr.some((input) => {
		//~ if (!input.value) {
			//~ input.style.border = "1px solid red;"
			//~ input.focus();
		//~ }
	//~ }) 
//~ }

//~ function openStripe(){
	//~ window.open("https://buy.stripe.com/test_14k8Az0qtbPC8KseUW", "_self");
	//~ createTicket();
//~ }

function loadVisitorTypes() {
	frappe.call({
		'method': "lifefair.lifefair.tickets.get_visitor_type",
		'callback': function (response) {
			visitor_types = response.message;
			
			var visitorDropdown = document.getElementById("dropdown");
			for (var i = 0; i < visitor_types.length; i++ ) {
				var visitor_li = document.createElement('li');
				visitor_li.innerHTML =`<button class="btnOrange" onclick="userSelection('${visitor_types[i]}')">${visitor_types[i]}</button>`;
				visitorDropdown.appendChild(visitor_li);
			}
		}
	})
}

function loadBlocks(anlass) {

	frappe.call({
		'method': "lifefair.lifefair.tickets.get_blocks",
		'args': {
			meeting: anlass,
			usertype: initialState.userTypeValue
		},
		'callback': function (response) {
            blocks = response.message;
            
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
										document.getElementById(`vormittag_${block.neues_datum}_${dayName}`).appendChild(card);
									  } else if ( timeFilter[j] == 2){
										  card.classList.add('nachmittag');
										  var cloneCard = card.cloneNode(true);
										  document.getElementById(`nachmittag_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
										  } else {
											  card.classList.add('abend');
											  var cloneCard = card.cloneNode(true);
											  document.getElementById(`abend_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
											  }
								  }
							}
						} else {
							
							var OnetimeRange = block.time.split("-");
							var timeFilter = checkTime(OnetimeRange);
							for (var i = 0; i < timeFilter.length; i++ ) {
								if (timeFilter[i] == 1) {
									card.classList.add('vormittag');
									document.getElementById(`vormittag_${block.neues_datum}_${dayName}`).appendChild(card);
								} else if ( timeFilter[i] == 2){
									card.classList.add('nachmittag');
									var cloneCard = card.cloneNode(true);
									document.getElementById(`nachmittag_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
								} else {
									card.classList.add('abend');
									var cloneCard = card.cloneNode(true);
									document.getElementById(`abend_${block.neues_datum}_${dayName}`).appendChild(cloneCard);
								}
							}
						}
				  } 
			});
			
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
			
			// Like this all the blocks will automatically appear 
			titleShowAll(); 
		}
		
	});
}

function nachbestellenBtn() {
	document.getElementById("step3").style.display = "none";
	document.getElementById("step0").style.display = "none";
	
	userDefined = "Yes";
	inTheChekout = true;
	window.localStorage.removeItem("ADDRESSONE");
	window.localStorage.removeItem("TICKETS");
	initialState.addressOne = [];
	initialState.ticketNum = null;
	initialState.stripe = "No";
	localStorage.setItem("STRIPE", JSON.stringify(initialState.stripe));
	
	document.getElementById("step1").style.display = "block";
	document.querySelector(".positionFixed").style.display = "block";
	document.getElementById("warenkorb").style.display = "block";
	document.getElementById("warenkorb").classList.remove("grey");
	cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT BESTELLEN</p>`;
	
	if ( initialState.rechCheck == "Yes" ) {
		
		document.getElementById("gleiche").checked = true;
		document.getElementById("step2").style.display = "block";
		
		var herrFrauTwo = document.getElementById("inputHerrFrauTwo");
		var lastnameTwo = document.getElementById("inputSurnameTwo");
		var firstnameTwo = document.getElementById("inputFirstnameTwo");
		var firmaTwo = document.getElementById("inputFirmaTwo");
		var funktionTwo = document.getElementById("inputFunktionTwo");
		var phoneTwo = document.getElementById("inputPhoneTwo");
		var emailTwo = document.getElementById("inputEmailTwo");  
		var adresseTwo = document.getElementById("inputAdresseTwo");
		var landTwo = document.getElementById("inputLandTwo");
		var plzOrtTwo = document.getElementById("inputOrtTwo");
		
		//console.log("initialState.addressTwo", initialState.addressTwo);

		herrFrauTwo.value = initialState.addressTwo.herrFrau;
		firstnameTwo.value = initialState.addressTwo.firstname;
		lastnameTwo.value = initialState.addressTwo.lastname;
		adresseTwo.value = initialState.addressTwo.adresse;
		emailTwo.value = initialState.addressTwo.email;
		phoneTwo.value = initialState.addressTwo.phone;
		firmaTwo.value = initialState.addressTwo.firma;
		funktionTwo.value = initialState.addressTwo.funktion;
		plzOrtTwo.value = initialState.addressTwo.plz + " " + initialState.addressTwo.ort;
		landTwo.value = initialState.addressTwo.land;
	}
}

function zuruckZurSeite() {
	window.localStorage.clear();
	window.open("https://sges.ch/", "_self");
}

function successPayment() {
	document.getElementById("step0").style.display = "none";
	document.getElementById("warenkorb").style.display = "none";
	document.getElementById("step1").style.display = "none";
	document.querySelector(".positionFixed").style.display = "none";
	document.getElementById("step3").style.display = "block";
	
	initialState.stripe = "Yes"
	localStorage.setItem("STRIPE", JSON.stringify(initialState.stripe));
	createTicket()
}

function loadEndMsg() {
	document.getElementById("step0").style.display = "none";
	document.getElementById("warenkorb").style.display = "none";
	document.getElementById("step1").style.display = "none";
	document.querySelector(".positionFixed").style.display = "none";
	document.getElementById("step3").style.display = "block";
	anlass = initialState.meeting;

		setTimeout(endMessage(), 3000);

	//~ clearFields.forEach((element) => {
		//~ if (element.type == "text") {
			//~ element.value = "";
		//~ } else if (element.type == "checkbox") {
			//~ element.checked = false;
			//~ }
	//~ });
}

function endMessage(){
	
	var endMsgContainer = document.getElementById("step3");

	endMsgContainer.innerHTML = `
		<h1 class="endMsgTitle">TICKETKAUF ERFOLGREICH</h1>
		<p class="endMsgTextOne"> Herzlichen Dank ${initialState.addressOne.herrFrau} ${initialState.addressOne.akademishTitle} ${initialState.addressOne.lastname} ${initialState.addressOne.firstname} für Ihren Ticketkauf. Ihr Ticket Nr.${initialState.ticketNum}  wird Ihnen per E-mail an ${initialState.addressOne.email} zugestellt.</p>
		<div class="infoI">i</div> 
	`;
	
	// To know the day and time of the blocks and with this if the Lunch or Apero is included
	for (var x = 0; x < initialState.cart.sort((a, b) => a.neues_datum > b.neues_datum).length; x++ ) {
		var infoDayName = null;
		var daytConvert = new Date(initialState.cart[x].neues_datum);
		var infoDayFlag = daytConvert.toLocaleString('de-ch', {weekday: 'long'});
		if ( infoDayName != infoDayFlag ) {
			infoDayName = infoDayFlag;
		}
	
		var twoTimeRange = initialState.cart[x].time.split("und");
		if (twoTimeRange.length > 1) {
			for (var i = 0; i < twoTimeRange.length; i++ ) {
				var OnetimeRange = twoTimeRange[i].split("-");
				var timeFilter = checkTime(OnetimeRange);
				if (timeFilter[0] == 1) {
					initialState.info.push("Networking-Lunch und Apéro inklusiv am " + infoDayName);
				} else if ( timeFilter[1] == 2){
					initialState.info.push("Networking-Lunch und Apéro inklusiv am " + infoDayName);
				} else {
					initialState.info.push(" ");
				}
			}
		} else {
			var OnetimeRange = initialState.cart[x].time.split("-");
			var timeFilter = checkTime(OnetimeRange);
			if (timeFilter[0] == 1) {
				initialState.info.push("Networking-Lunch inklusiv am " + infoDayName);
			} else if ( timeFilter[0] == 2){
				initialState.info.push("Networking-Apéro inklusiv am " + infoDayName);
			} else {
				initialState.info.push(" ");
			}
		} 
		if (initialState.info[x] != " ") {
			endMsgContainer.innerHTML += `<div class="infoDiv innerInfoDiv infoDetails"> ${initialState.info[x]} </div>`;
		}
	}

	endMsgContainer.innerHTML += `
		<div class="infoDiv innerInfoDiv infoDetails">Übernachtung empfohlen. &nbsp;&nbsp; <a href="https://sges.ch/official-congress-hotel-2022/" target="_blank" class="hotelLink"> PARKHOTEL-LINK </a></div>
		<div class="endMsgButtonsContainer">
		<a href="/api/method/frappe.utils.print_format.download_pdf?doctype=Sales Invoice&name=${initialState.sinv}&format=Sales Inovice - Ticket&no_letterhead=0&_lang=de" class="endMsgBtn downloadBtn" download>TICKET / RECHNUNG HERUNTERLADEN</a>
		<button class="endMsgBtn nachbestellenBtn" onclick="nachbestellenBtn()">TICKETS NACHBESTELLEN</button>
		<button class="endMsgBtn zuruckBtnTwo" onclick="zuruckZurSeite()">ZURÜCK ZUR STARTSEITE</button>   
		</div>
		<p class="endMsgTextTwo"> Wir freuen uns, Sie bald am Swiss Green Economy Symposium begrüssen zu dürfen.</p>
	`
}


document.addEventListener("DOMContentLoaded", function(event) {
    // add change triggers here
    // process command line arguments
    get_arguments();
    
    var container = document.querySelector(".my-5");
    container.classList.remove("container");
    container.classList.add("container-fluid");
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
			anlass = args['anlass']
			// When the payment goes through with Stripe, it calls this endpoint
			if (args['anlass'] == 'success') {
				successPayment();
			} else if (args['anlass'] == 'ticketkauf') {
				loadEndMsg();
			} else {
				anlass = args['anlass'];
				initialState.meeting = args['anlass'];
				localStorage.setItem("MEETING", JSON.stringify(initialState.meeting));
				loadVisitorTypes();
				loadBlocks(args['anlass']);
			}
		}
    }
}
