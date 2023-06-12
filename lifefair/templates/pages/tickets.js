var anlass;
var blocks;
var interests = [];
var firmen = [];
var itemVal;
var dayName;
var dayFlag = "all";
var currentDatum = null;
var currentTimeSlot = "all";
var currentZeit = null;
var currentThema = null;
var currentFirma = null;
var rechAdd = "notDone";
//var datumFlag = 0;
var inTheChekout = false;
var userDefined = "No"
var initialState = {
    meeting: JSON.parse(localStorage.getItem("MEETING")) || "",
    userTypeValue : JSON.parse(localStorage.getItem("USER")) || "Student",
    cart : JSON.parse(localStorage.getItem("CART")) || [],
    total: JSON.parse(localStorage.getItem("TOTAL")) || 0,
    discountTotal: JSON.parse(localStorage.getItem("NEWTOTAL")) || -1,
    //cartTwo: JSON.parse(localStorage.getItem("CARTTWO")) || [],
    addressOne: JSON.parse(localStorage.getItem("ADDRESSONE")) || [],
    addressTwo: JSON.parse(localStorage.getItem("ADDRESSTWO")) || [],
    info: JSON.parse(localStorage.getItem("INFO")) || [],
    rechCheck: JSON.parse(localStorage.getItem("RECHCHECK")) || "No",
    stripe: JSON.parse(localStorage.getItem("STRIPE")) || 0,
    ticketNum: JSON.parse(localStorage.getItem("TICKETS")) || null,
    sinv: JSON.parse(localStorage.getItem("SINV")) || null,
    signature: JSON.parse(localStorage.getItem("SIGNATURE")) || null,
    source: JSON.parse(localStorage.getItem("SOURCE")) || null,
};
var tags = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag" ];
var block_cards = document.getElementsByClassName("filterDiv");
var datumBtn = document.getElementById("filterBtnContainerDATUM");
var cartElement = document.querySelector(".cartElement");
var cartTotal = document.querySelector(".cartTotal");
var cartbButton = document.querySelector(".cartBtn");
var selectedFilterDiv = document.getElementById("selectedFilters");
var btnContainerOne = document.getElementById("filterBtnContainerUSER");
var btnContainerTwo = document.getElementById("filterBtnContainerDATUM");
var btnContainerThree = document.getElementById("filterBtnContainerZEIT").querySelectorAll("button");
var btnContainerFour = document.getElementById("filterBtnContainerTHEMA");
//~ var btnContainerFive = document.getElementById("filterBtnContainerFIRMA");
var clearFields = document.getElementById("clearField").querySelectorAll("input");
var clearFieldsTwo = document.getElementById("clearFieldTwo").querySelectorAll("input");
var popUpDiv = document.getElementById("modal");
var errorContainer = document.querySelector(".error");
var active = document.querySelector(".active");

updateCart();
//~ filterSelection("all");


function userSelection(c, button) {
    btnContainerOneFunc(c, button) // Creates the upper selected orange filter
    userDefined = "Yes";
    var currentUser;
    initialState.userTypeValue = c;
    localStorage.setItem("USER", JSON.stringify(initialState.userTypeValue));
    
    if ( currentUser != initialState.userTypeValue ) {
        currentUSer = initialState.userTypeValue;

        loadBlocks(anlass)
        datumBtn.innerHTML = `<h2 class="filterTitle" id="datum">DATUM</h2>`;
        errorContainer.innerHTML = "";
        initialState.cart = [];
        localStorage.setItem("CART", JSON.stringify(initialState.cart));
    }
    
    document.getElementById("ichBin").classList.remove("shake");
    document.getElementById("filterBtnContainerDATUM").classList.remove("grey");
    document.getElementById("filterBtnContainerZEIT").classList.remove("grey");
    document.getElementById("filterBtnContainerTHEMA").classList.remove("grey");
    //~ document.getElementById("filterBtnContainerFIRMA").classList.remove("grey");
    document.getElementById("warenkorb").classList.remove("grey");
    document.querySelector(".display").classList.remove("grey");
    //document.querySelector(".display").style.display = "block";
    btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
    btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
    btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
    btnContainerThree.forEach(btn => btn.classList.remove("active"));
    btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
    btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
    //FirmaFilter
    //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
    //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))

    var userMenu = document.getElementById("userMenu");
    var userMenuDiv = document.createElement('div');
    userMenuDiv.classList.add('userMenuDiv');
    userMenuDiv.innerHTML = `<div class="userMenuClass" onclick="openDropdown()"><div></div><p>${c}</p> <img class='dropdownImg' src="/assets/lifefair/images/arrow.png"/ style="padding-top: 5px;"></div>`;
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

function filterDatum(date, button) {
    //console.log("filterDatum", date, button);
    errorContainer.innerHTML = "";
    currentTimeSlot = "all";
    currentThema = null;
    dayName = "iAmNull";
    titleFilter(dayName);
    dayName = date;

    if (userDefined == "No") {
        document.getElementById("ichBin").classList.toggle("shake");
    } else {
        currentDatum = date;
        currentZeit = null;
        if (selectedFilterDiv.children.length == 2 && dayFlag == "all" ) {
            btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("active"));
            btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("toggleFilter"));
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        } else if (selectedFilterDiv.children.length == 3) {
            btnContainerThree.forEach(btn => btn.classList.remove("active"));
            btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
            btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("active"));
            btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("toggleFilter"));
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        }  else if (selectedFilterDiv.children.length == 4) {
            btnContainerThree.forEach(btn => btn.classList.remove("active"));
            btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild); 
         } //~ else if (selectedFilterDiv.children.length == 5) {
            //~ btnContainerThree.forEach(btn => btn.classList.remove("active"));
            //~ btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            //~ btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        //~ }
            dayFlag = date;
            //if (c == "all") c = "";

            for (var i = 0; i < block_cards.length; i++) {
              removeClass(block_cards[i], "show");
                if (block_cards[i].className.indexOf(date) > -1) {
                    addClass(block_cards[i], "show");
                }
            }
            
            blueThemaActive(date, button);
            titleFilter(dayName);
            //~ //console.log('newStr c', c);
            //~ //console.log('dayName', dayName);
        }
}

function purifyInterest(interest) {
    return interest.replace(/[^a-zA-Z]/g, "");
}

function filterSelection(filter, button) {
    //console.log("filterSelection",filter, button)
    
    if ((userDefined == "No") && (filter != "all")) {
        document.getElementById("ichBin").classList.toggle("shake");
    } else {
        if (currentTimeSlot == "all" && dayFlag == "all") {
            titleFilter(filter)

        } else if (currentTimeSlot == "all" && currentZeit == null ) {
            titleFilter(filter)
        } 
            
            for (var i = 0; i < block_cards.length; i++) {
              removeClass(block_cards[i], "show");
              if ((filter === "all") || (block_cards[i].className.indexOf(filter) > -1)) {
                  addClass(block_cards[i], "show");
              }
            }
            //FirmaFilter
			//~ if  (button.closest("#filterBtnContainerTHEMA")){
				//~ var filterBtnContainer = document.getElementById("filterBtnContainerFIRMA");
				//~ var buttons = filterBtnContainer.getElementsByTagName("button");

				//~ for (var i = 0; i < buttons.length; i++) {
					//~ if (buttons[i].classList.contains("active")) {
						//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
						//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
						//~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
						//~ break;
					//~ }
				//~ }
				//~ currentFirma = null;
				currentThema = filter;
				cardFilter(filter);
			//~ } else if (button.closest("#filterBtnContainerFIRMA")) {
				//~ currentFirma = filter;
				//~ if (currentThema && currentFirma) {
					//~ filterThemaAndFirma(currentThema, currentFirma)
				//~ } else {
					//~ cardFilter(filter);
				//~ }
			//~ }
            
				blueThemaActive(filter, button);
        //}
      }
//~ }
}

// it shows all the cards and reset all the initial values
function titleShowAll() {
    //console.log("in the tittle showAll fuuunc")
    var localTitle;
    currentTimeSlot = "all";
    dayFlag = "all";
    window.localStorage.removeItem("ADDRESSONE");
    window.localStorage.removeItem("TICKETS");
    initialState.addressOne = [];
    initialState.ticketNum = null;
    initialState.total = 0;
    localStorage.setItem("TOTAL", JSON.stringify(initialState.total));
    initialState.discountTotal = -1;
    localStorage.setItem("NEWTOTAL", JSON.stringify(initialState.discountTotal));
    initialState.stripe = 0;
    localStorage.setItem("STRIPE", JSON.stringify(initialState.stripe));
    console.log(currentTimeSlot, dayFlag);
    initialState.rechCheck = "No";
    localStorage.setItem("RECHCHECK", JSON.stringify(initialState.rechCheck));
    
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
    //~ localTitle = document.querySelectorAll('.filterDiv');
    //~ for ( var j = 0; j < localTitle.length; j++ ) {
        //~ //if (localTitle[j].children.length > 1) {
            //~ localTitle[j].style.display = "inline";
            //~ console.log("initial")
        //~ //}
    //~ }
    
    for (var i = 0; i < block_cards.length; i++) {
        addClass(block_cards[i], "show");
    }
}

function titleFilter(c) {
    //console.log("c in titleFilter", c);
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
            
            //~ //Show all cards
            //~ localTitle = document.querySelectorAll('.filterDiv');
            //~ for ( var j = 0; j < localTitle.length; j++ ) {
                //~ localTitle[j].style.display = "block";
            //~ }
            for (var i = 0; i < block_cards.length; i++) {
                addClass(block_cards[i], "show");
            }
        }
        
        if (c != "" && c != null) {
            

            for (var i = 0; i < blocks.length; i++ ) {
                
                if ( currentTimeSlot == "all" && dayFlag == "all") {
                    //console.log("both all")
                    for (var j = 0; j < tags.length; j++ ) {
                        if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${tags[j]}`) != null) {
                            if (document.getElementById(`vormittag_${blocks[i].neues_datum}_${tags[j]}`).querySelector(`.${c}`) == null ) {
                                document.getElementById(`vormittag_${blocks[i].neues_datum}_${tags[j]}`).style.display = "none";
                            } else {
                                flag = 1;
                                document.getElementById(`vormittag_${blocks[i].neues_datum}_${tags[j]}`).style.display = "block";
                            }
                        }
                        
                        if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${tags[j]}`) != null) {
                            if (document.getElementById(`nachmittag_${blocks[i].neues_datum}_${tags[j]}`).querySelector(`.${c}`) == null ) {
                                document.getElementById(`nachmittag_${blocks[i].neues_datum}_${tags[j]}`).style.display = "none";
                            } else {
                                flag = 1;
                                document.getElementById(`nachmittag_${blocks[i].neues_datum}_${tags[j]}`).style.display = "block";
                            }
                        }
                        
                        if (document.getElementById(`abend_${blocks[i].neues_datum}_${tags[j]}`) != null ) {
                            if (document.getElementById(`abend_${blocks[i].neues_datum}_${tags[j]}`).querySelector(`.${c}`) == null ) {
                                document.getElementById(`abend_${blocks[i].neues_datum}_${tags[j]}`).style.display = "none";
                            } else {
                                flag = 1;
                                document.getElementById(`abend_${blocks[i].neues_datum}_${tags[j]}`).style.display = "block";
                            }
                        }
                    }
                } else {
                    //console.log("in the else", dayName, c)
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
    //console.log("in cardFilter", c)
    var flag = 0;
    
    if (currentTimeSlot != "all" && dayFlag != "all") {
        //Hidde all cards
        //~ var localTitle = document.querySelectorAll('.filterDiv');
        //~ for ( var j = 0; j < localTitle.length; j++ ) {
            //~ localTitle[j].style.display = "none";
        //~ }
        for (var i = 0; i < block_cards.length; i++) {
              removeClass(block_cards[i], "show");
            }
        if (c != "" && c != null) {
            
            if ( currentTimeSlot == "vormittag" ) {
                var vormittagCards = document.querySelectorAll('.filterDiv');
                for (var i = 0; i < vormittagCards.length; i++ ) {
                    
                    if ( vormittagCards[i].classList.contains(`${dayName}`) == false || vormittagCards[i].classList.contains(`${c}`) == false || vormittagCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
                        //vormittagCards[i].style.display = "none";
                        removeClass(vormittagCards[i], "show");
                    } else {
                            flag = 1;
                            //vormittagCards[i].style.display = "block";
                            addClass(vormittagCards[i], "show")
                            titleFilter(dayName)
                    }
                }
            }
            if ( currentTimeSlot == "nachmittag" ) {
                var nachmittagCards = document.querySelectorAll('.filterDiv');
                for (var i = 0; i < nachmittagCards.length; i++ ) {
                    
                    if ( nachmittagCards[i].classList.contains(`${dayName}`) == false || nachmittagCards[i].classList.contains(`${c}`) == false || nachmittagCards[i].classList.contains(`${currentTimeSlot}`) == false) {
                        //nachmittagCards[i].style.display = "none";
                        removeClass(nachmittagCards[i], "show");
                    } else {
                            flag = 1;
                            //nachmittagCards[i].style.display = "block";
                            addClass(nachmittagCards[i], "show")
                            titleFilter(dayName)
                    }
                }
            }
            if ( currentTimeSlot == "abend") {
                var abendCards = document.querySelectorAll('.filterDiv');
                for (var i = 0; i < abendCards.length; i++ ) {
                    
                    if ( abendCards[i].classList.contains(`${dayName}`) == false || abendCards[i].classList.contains(`${c}`) == false || abendCards[i].classList.contains(`${currentTimeSlot}`) == false ) {
                        //abendCards[i].style.display = "none";
                        removeClass(abendCards[i], "show");
                    } else {
                            flag = 1;
                            //abendCards[i].style.display = "block";
                            addClass(abendCards[i], "show")
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
}


//~ function filterThemaAndFirma(currentThema, currentFirma) {
    //~ //console.log("in filterThemaAndFirma", currentThema, currentFirma)
    //~ var flag = 0;
    
    //~ if (currentThema && currentFirma) {
		
		//~ if (currentTimeSlot != "all" && dayFlag != "all") {
            
            //~ if ( currentTimeSlot == "vormittag" ) {
                //~ var vormittagCards = document.querySelectorAll('.filterDiv.show');
                //~ for (var i = 0; i < vormittagCards.length; i++ ) {
                    
                    //~ if ( vormittagCards[i].classList.contains(`${currentThema}`) == true && vormittagCards[i].classList.contains(`${currentFirma}`) == false || vormittagCards[i].classList.contains(`${currentTimeSlot}`) == false) {
                        //~ //vormittagCards[i].style.display = "none";
                        //~ removeClass(vormittagCards[i], "show");
                    //~ } else if (vormittagCards[i].classList.contains(`${currentThema}`) == false && vormittagCards[i].classList.contains(`${currentFirma}`) == true || vormittagCards[i].classList.contains(`${currentTimeSlot}`) == false) {
						//~ removeClass(vormittagCards[i], "show");
                    //~ } else {
                            //~ flag = 1;
                            //~ //vormittagCards[i].style.display = "block";
                            //~ addClass(vormittagCards[i], "show")
                            //~ titleFilter(dayName)
                    //~ }
                //~ }
            //~ }
            //~ if ( currentTimeSlot == "nachmittag" ) {
                //~ var nachmittagCards = document.querySelectorAll('.filterDiv.show');
                //~ for (var i = 0; i < nachmittagCards.length; i++ ) {
                    
                    //~ if ( nachmittagCards[i].classList.contains(`${currentThema}`) == true && nachmittagCards[i].classList.contains(`${currentFirma}`) == false || nachmittagCards[i].classList.contains(`${currentTimeSlot}`) == false) {
                        //~ //nachmittagCards[i].style.display = "none";
                        //~ removeClass(nachmittagCards[i], "show");
                    //~ } else if (nachmittagCards[i].classList.contains(`${currentThema}`) == false && nachmittagCards[i].classList.contains(`${currentFirma}`) == true || nachmittagCards[i].classList.contains(`${currentTimeSlot}`) == false) {
						//~ removeClass(nachmittagCards[i], "show");
                    //~ } else {
                            //~ flag = 1;
                            //~ //nachmittagCards[i].style.display = "block";
                            //~ addClass(nachmittagCards[i], "show")
                            //~ titleFilter(dayName)
                    //~ }
                //~ }
            //~ }
            //~ if ( currentTimeSlot == "abend") {
                //~ var abendCards = document.querySelectorAll('.filterDiv.show');
                //~ for (var i = 0; i < abendCards.length; i++ ) {
                    
                    //~ if ( abendCards[i].classList.contains(`${currentThema}`) == true && abendCards[i].classList.contains(`${currentFirma}`) == false || abendCards[i].classList.contains(`${currentTimeSlot}`) == false) {
                        //~ //abendCards[i].style.display = "none";
                        //~ removeClass(abendCards[i], "show");
                    //~ } else if (abendCards[i].classList.contains(`${currentThema}`) == false && abendCards[i].classList.contains(`${currentFirma}`) == true || abendCards[i].classList.contains(`${currentTimeSlot}`) == false) {
						//~ removeClass(abendCards[i], "show");
                    //~ } else {
                        //~ flag = 1;
                        //~ //abendCards[i].style.display = "block";
                        //~ addClass(abendCards[i], "show")
                        //~ titleFilter(dayName)
                    //~ }
                //~ }
            //~ }

      //~ } else {
			//~ for (var i = 0; i < block_cards.length; i++) {
              //~ removeClass(block_cards[i], "show");
            //~ }
			//~ var displayedCards = document.querySelectorAll(`.${currentThema}.${currentFirma}`);
			//~ if (displayedCards.length != 0) {
				//~ for (var i = 0; i < displayedCards.length; i++) {
				  //~ addClass(displayedCards[i], "show")
				//~ }

				//~ var timeSlotDivs = document.querySelectorAll('[id^="vormittag"], [id^="nachmittag"], [id^="abend"]');

				//~ for (var i = 0; i < timeSlotDivs.length; i++) {

					//~ if (document.getElementById(`${timeSlotDivs[i].id}`) != null ) {
						//~ if (document.getElementById(`${timeSlotDivs[i].id}`).querySelector(`.${currentThema}.${currentFirma}`) != null ) {
							//~ document.getElementById(`${timeSlotDivs[i].id}`).style.display = "block";
							//~ flag = 1;
						//~ }else {
							//~ document.getElementById(`${timeSlotDivs[i].id}`).style.display = "none";
						//~ }
					//~ }
				
				//~ }
			//~ } else {
				//~ errorContainer.innerHTML = "Keine Ereignisse gefunden";
			//~ }
	  //~ }
	  
	//~ if ( flag == 0) {
		//~ titleFilter("iAmNull")
		//~ errorContainer.innerHTML = "Keine Ereignisse gefunden";
	//~ } else {
		//~ errorContainer.innerHTML = "";
	//~ }
  //~ }
//~ }

function filterTimeSlot(c) {
    //console.log("c in filterTimeSlot", c);
    var flag = 0;
    if (userDefined == "No") {
        document.getElementById("ichBin").classList.toggle("shake");
    } else if (currentDatum == null) {
        document.getElementById("datum").classList.toggle("shake");
    } else {
        currentTimeSlot = c;
		currentThema = null;
		
        if (selectedFilterDiv.children.length == 3 && currentZeit == null ) {
            errorContainer.innerHTML = "";
            btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("active"));
            btnContainerFour.querySelectorAll("button").forEach((element) => element.classList.remove("toggleFilter"));
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        } else if (selectedFilterDiv.children.length == 4) {
            errorContainer.innerHTML = "";
            btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        } //~ else if (selectedFilterDiv.children.length == 5) {
			//~ errorContainer.innerHTML = "";
            //~ btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            //~ btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
            //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
			//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        //~ }
        currentZeit = c;
        
        //Show all cards
        //~ localTitle = document.querySelectorAll('.filterDiv');
        //~ for ( var j = 0; j < localTitle.length; j++ ) {
            //~ localTitle[j].style.display = "block";
        //~ }
        for (var i = 0; i < block_cards.length; i++) {
            addClass(block_cards[i], "show");
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
  var elementClasses = element.className.split(" ");
  if (elementClasses.indexOf(name) == -1) {
      element.classList.add(name);
  }
}

function removeClass(element, name) {
  element.classList.remove(name);
}

// Add active class to the current button in the respective container and highlight it the top
function btnContainerOneFunc(c, button){
    
    btnContainerOne.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("active");
    });
    
    selectedFilterDiv.innerHTML = '';
    var orangeFilterBlock;
    orangeFilterBlock = document.createElement('li');
    orangeFilterBlock.classList.add('filter');
    var orange = document.querySelector(".orangeFilter");
    var answer = selectedFilterDiv.contains(orange);
    if (answer == true) {
        var userTypeChildLi = selectedFilterDiv.getElementsByTagName('li')[0];
        orangeFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(1)">X</div>`;
        orangeFilterBlock.classList.add('orangeFilter');
        selectedFilterDiv.replaceChild(orangeFilterBlock, userTypeChildLi);
    } else {
    //    console.log("clicking orange answer false create new")
        orangeFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(1)">X</div>`;
        orangeFilterBlock.classList.add('orangeFilter');
        selectedFilterDiv.insertBefore(orangeFilterBlock, selectedFilterDiv.firstChild);
    }
    
    button.classList.add("active");
}

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
    //~ console.log("in the blue thema c", c);
    
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
        } else if  (button.closest("#filterBtnContainerTHEMA")){
            document.getElementById("ichBin").classList.remove("shake");
            button.addEventListener("click", toggleAction(button, 4))
            
            var blueThema = document.querySelector(".themaBlueFilter");
            var answer = selectedFilterDiv.contains(blueThema);
            var blueFilterBlock;
            if (answer == true) {
                var themaChildLi = selectedFilterDiv.lastChild;
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
            
        } //~ else if  (button.closest("#filterBtnContainerFIRMA")){
            //~ document.getElementById("ichBin").classList.remove("shake");
            //~ button.addEventListener("click", toggleAction(button, 5))
            
            //~ var blueFirma = document.querySelector(".firmaBlueFilter");
            //~ var answer = selectedFilterDiv.contains(blueFirma);
            //~ var blueFilterBlock;
            //~ if (answer == true) {
                //~ var firmaChildLi = selectedFilterDiv.lastChild;
                //~ blueFilterBlock = document.createElement('li');
                //~ blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(5)">X</div>`;
                //~ blueFilterBlock.classList.add('firmaBlueFilter');
                //~ blueFilterBlock.classList.add('filter');
                //~ selectedFilterDiv.replaceChild(blueFilterBlock, firmaChildLi);
            //~ } else {
                //~ blueFilterBlock = document.createElement('li');
                //~ blueFilterBlock.innerHTML += `${c} &nbsp;&nbsp; <div class="remove" onclick="removeFilter(5)">X</div>`;
                //~ blueFilterBlock.classList.add('firmaBlueFilter');
                //~ blueFilterBlock.classList.add('filter');
                //~ selectedFilterDiv.appendChild(blueFilterBlock);
            //~ }
            
        //~ }
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
            } //~  else if (num == 5) {
                //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
                //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            //~ }
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
             } //~ else if (num == 5) {
                //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
                //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            //~ }
            button.classList.add("toggleFilter");
            button.classList.add("active");
        }
} 

function removeFilter(num) {
    console.log('in the remove', num);
    errorContainer.innerHTML = "";
    
    if (num == 1 ){
        selectedFilterDiv.removeChild(selectedFilterDiv.firstElementChild);
        btnContainerOne.querySelectorAll("button").forEach(btn => {
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
        document.querySelector(".userMenuDiv").innerHTML =  "";
    } else if ( num == 2) {
        currentDatum = null;
        currentZeit = null;
        
        if (selectedFilterDiv.children.length == 2) {
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        } else if (selectedFilterDiv.children.length == 3) {
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        } else if (selectedFilterDiv.children.length == 4) {
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
         } //~ else if (selectedFilterDiv.children.length == 5) {
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
        //~ }
        
        btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
        btnContainerTwo.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"));
        btnContainerThree.forEach(btn => btn.classList.remove("active"));
        btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
        //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        document.getElementById("selectedFilters").querySelectorAll("li").forEach(li => console.log("li", li));
        titleShowAll();

    } else if ( num == 3) {
        currentZeit = null;
        //selectedFilterDiv.children[2].remove();
        if (selectedFilterDiv.children.length == 3) {
			 selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		} else if (selectedFilterDiv.children.length == 4) {
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
			selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		 } //~ else if (selectedFilterDiv.children.length == 5) {
			//~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
            //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild);
		//~ }
        btnContainerThree.forEach(btn => btn.classList.remove("active"));
        btnContainerThree.forEach(btn => btn.classList.remove("toggleFilter"));
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
        //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        filterDatum(dayName);
        
    } else if ( num == 4) {
        if (selectedFilterDiv.children.length == 4) selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
        //selectedFilterDiv.children[3].remove();
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
        //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        //~ console.log("currentZeit", currentZeit)
        if (currentZeit != null) {
            filterTimeSlot(selectedFilterDiv.children[2].textContent.split(" ")[0].toLowerCase());
        } else if (currentZeit == null && currentDatum != null) {
            console.log("in the zeit null  but datum no")
            filterDatum(dayFlag);
            selectedFilterDiv.children[2].remove();
        } else if (currentZeit == null && currentDatum == null){
            console.log("in the else where zeil null and time all")
            selectedFilterDiv.children[1].remove();
        }
    } else if ( num == 5) {
		selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
		btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        btnContainerFour.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
        filterTimeSlot(selectedFilterDiv.children[2].textContent.split(" ")[0].toLowerCase());
        //Firmafilter
        //~ if (selectedFilterDiv.children.length == 5) selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
        //selectedFilterDiv.children[3].remove();
        //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
        //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        
        //~ var text = selectedFilterDiv.children[3].textContent.split(" ")[0].toLowerCase();
        //~ var capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
        //~ cardFilter(capitalizedText);
    } //~ else if ( num == 6) {
        //~ selectedFilterDiv.removeChild(selectedFilterDiv.lastElementChild)
        //~ //selectedFilterDiv.children[4].remove();
        //~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("toggleFilter"))
		//~ btnContainerFive.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
        //~ filterTimeSlot(selectedFilterDiv.children[2].textContent.split(" ")[0].toLowerCase());
    //~ }
 
    
    if (selectedFilterDiv.children.length == 1) {
        titleShowAll();
    }
    selectedFilterDiv.innerHTML.reload();
}

function checkTime(time) {
    //7 - 13 Vormitag; 13:01 - 17 Nachmittag; 18:00 - 23 Abend;
    if (time.length > 1) {
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
    } else {
        return time[0];
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
    else if ( parseInt(timeRange[0]) >= 17) {
        if (parseInt(timeRange[0]) == 17 && parseInt(timeRange[1]) >= 0) {
            return 2
        } else {
            return 3
        }
    } else {
        return 2
    }
}

function checkItem(i, condition) {
    var currentCartItem;
    var answer;
    
    initialState.cart.some((item) => {
        if (item.neues_datum == blocks[i].neues_datum && item.time == blocks[i].time) {
            currentCartItem = item;
            answer = true;
        } else if (item.neues_datum == blocks[i].neues_datum && item.time.split("-")[0].split(":")[0] == blocks[i].time.split("-")[0].split(":")[0]) {
            currentCartItem = item;
            answer = true;
        } else if (item.neues_datum == blocks[i].neues_datum && item.time.split("-")[0].split(":")[0] == blocks[i].time.split("-")[1].split(":")[0]) {
            currentCartItem = item;
            answer = true;
        } else if (item.neues_datum == blocks[i].neues_datum && item.time.split("-")[1].split(":")[0] == blocks[i].time.split("-")[0].split(":")[0]) {
            currentCartItem = item;
            answer = true;
        } else if (item.neues_datum == blocks[i].neues_datum && item.time.split("-")[1].split(":")[0] == blocks[i].time.split("-")[1].split(":")[0]) {
            currentCartItem = item;
            answer = true;
        }
    });
    
    if (condition == "cart") {
     return answer;
    } else if (condition == "popUp"){
        return currentCartItem;
    }
}

function addToCart(i, ...priority) {
	console.log("i and priority", i, priority[0])
    if (userDefined == "No") {
        document.getElementById("ichBin").classList.toggle("shake");
    } else {
        if (initialState.cart.some((item) => item.short_name == blocks[i].short_name)) {
            console.log("already there", blocks[i].short_name);
            //document.getElementById("warenkorb").classList.add("shake");
        } else if (checkItem(i, "cart") == true) {
            console.log("in the else if cart")
            popUp(i);
        } else {
			
			if (blocks[i].official_title.includes('Firmenbesuch') && priority[0] != "done") {
				// Show a pop-up/modal with the firmen
				showFirmen(blocks[i], i);
			} else {
				initialState.cart.push({
                 ...blocks[i], 
				});
			} 
         }
      updateCart();
    } 
}

function popUp(i) {
    var currentCartItem = checkItem(i, "popUp")
    console.log("popUp currentCartItem", currentCartItem)
    
    popUpDiv.innerHTML = `
            <div class="popUp"> 
                <div class="popUpContent"> 
                    <p class="popUpTittle">SIE SIND BEREITS ANGEMELDET FÜR</p>
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
	console.log("popUpConfirm", i)
    var currentCartItem = checkItem(i, "popUp")
    console.log("currentCartItem", currentCartItem)
    popUpDiv.style.display = "none";
    var index = initialState.cart.findIndex(item => item.official_title == currentCartItem.official_title);

		initialState.cart[index] = blocks[i];
		console.log("index", index)
		
		if (blocks[i].official_title.includes('Firmenbesuch')) {
				// Show a pop-up/modal with the firmen
				showFirmen(initialState.cart[index], i);
		} else {
		updateCart();
	}

}

function popUpCancel() {
    popUpDiv.style.display = "none";
}

function showFirmen(block, i) {
    console.log("showFirmen", block)
    var blockfirmen = block.firmen.split(",");
    console.log("Firmeeeen", blockfirmen)
    
    popUpDiv.innerHTML = `
			<div class="popUp" id="firmenModal"> 
			  <div class="popUpContent">
				<p class="popUpTittle">IN DER REIHENFOLGE DES VORRANGIGEN BESUCHS ZIEHEN</p>
				<ol id="firmenList" class="firmen-list"></ol>
				<div class="popUpBtnDiv"> 
					<button class="popUpCancel" onclick="popUpCancel()">ABBRECHEN</button> <button class="popUpConfirm" onclick="saveFirmenOrder(${i})">BESTÄTIGEN</button> 
				</div>
			  </div>
			</div>`;

	var modal = document.getElementById('firmenModal');
	var firmenList = document.getElementById('firmenList');
	
	firmenList.innerHTML = '';
	blockfirmen.forEach(function(firma) {
		var listItem = document.createElement('li');
		listItem.textContent = firma;
		listItem.classList.add('firmen-item');
		firmenList.appendChild(listItem);
	});

    popUpDiv.style.display = "block";
    enableDragging();
}

function enableDragging() {
  var firmenList = document.getElementById('firmenList');
  var firmenItems = firmenList.getElementsByClassName('firmen-item');

  // Add draggable attribute to firmen items
  Array.from(firmenItems).forEach(function(item) {
    item.draggable = true;
  });

  // Store the dragged item
  var draggedItem = null;

  // Handle dragstart event
  firmenList.addEventListener('dragstart', function(event) {
    draggedItem = event.target;
    event.target.classList.add('dragging');
  });

  // Handle dragover event
  firmenList.addEventListener('dragover', function(event) {
    event.preventDefault();
    var targetItem = event.target;

    // Move the dragged item
    if (targetItem !== draggedItem && targetItem.classList.contains('firmen-item')) {
      var rect = targetItem.getBoundingClientRect();
      var offset = rect.y + rect.height / 2 > event.clientY ? 0 : 1;
      firmenList.insertBefore(draggedItem, targetItem.nextSibling);
    }
  });

  // Handle dragend event
  firmenList.addEventListener('dragend', function(event) {
    event.target.classList.remove('dragging');
    draggedItem = null;
  });
}

function saveFirmenOrder(i) {
	var firmenList = document.getElementById('firmenList');
	var firmenPriorityOrder = [];
	var updatedblockFirmen = blocks[i];
	var firmen = Array.from(firmenList.getElementsByClassName('firmen-item')).map(function(firmaname) {
		//~ return item.textContent
		firmenPriorityOrder.push(firmaname.textContent);
	});
	updatedblockFirmen.firmen = firmenPriorityOrder.join(';')
	blocks[i] = updatedblockFirmen;
	console.log("blocks[i]", blocks[i])
	addToCart(i, "done")
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
			cartTotal.innerHTML = `<div class="alleArtikel"><p style=" font-size: 13px; padding-top: 5px; font-weight: bold;">inkl. MwSt 7.7%</p> </div> <div class="totalDisplay"><p>TOTAL</p> <p>${totalPrice.toFixed(2)}</p></div>`;	
			initialState.total = totalPrice;
			localStorage.setItem("TOTAL", JSON.stringify(initialState.total));
			var giftCard = document.getElementById("inputGutschein");
			if (giftCard) {
				checkGiftCard();
			}
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
    
    window.localStorage.removeItem("ADDRESSONE");
    initialState.addressOne = [];
    window.localStorage.removeItem("ADDRESSTWO");
    initialState.addressTwo = [];
    
}

function checkOut() {
    
    if (userDefined == "No") {
        document.getElementById("ichBin").classList.toggle("shake");
    } else if (initialState.cart.length == 0) {
        var shaketext = document.querySelector(".cartLeer")
            shaketext.classList.add("shake");
        } else {
            inTheChekout = true;
            
            var country_option = document.getElementById("inputLand");
            getCountries(country_option)
            
            document.getElementById("step0").style.display = "none";
            document.getElementById("step1").style.display = "block";
            document.querySelector(".warenkorbBtn").style.display = "block";
            //document.getElementById("inputLand").value = "Schweiz";
            cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT KAUFEN</p>`
        }
}

// Creating the Country Dropdown List
function getCountries(country_option, country_in_addrss_two) {
	frappe.call({
		'method': "lifefair.lifefair.tickets.get_countries",
		'callback': function (response) {
			countries = response.message;
			
			for (var i = 0; i < countries.length; i++ ) {
				//console.log("countrieees", countries[i].name)
				if (country_in_addrss_two) {
					country_option.innerHTML +=`<option class="btnOrange" selected="selected" value="${country_in_addrss_two}">${country_in_addrss_two}</option>`;
				} else if (countries[i].name == "Schweiz") {
					country_option.innerHTML +=`<option class="btnOrange" selected="selected" value="${countries[i].name}">${countries[i].name}</option>`;
				}
				country_option.innerHTML +=`<option class="btnOrange" value="${countries[i].name}">${countries[i].name}</option>`;
			}
		}
	})
}

//Watching over the rechnungAdresse checkbox in the checkout 
var rechnungAdresse = document.getElementById("gleiche");
rechnungAdresse.checked = false;
rechnungAdresse.addEventListener('change', function(e){
    if (rechnungAdresse.checked) {
        document.getElementById("step2").style.display = "block";
        var country_option = document.getElementById("inputLandTwo");
        getCountries(country_option)
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
                //~ initialState.total = parseFloat(newTotal.toFixed(2));
                //~ localStorage.setItem("TOTAL", JSON.stringify(initialState.total));
                
                initialState.discountTotal = parseFloat(newTotal.toFixed(2));
                localStorage.setItem("NEWTOTAL", JSON.stringify(initialState.discountTotal));
                cartTotal.innerHTML = `<div class="alleArtikel"><div style="display: flex; justify-content: space-between; padding-top: 5px;"><p style="margin: 0px; ">${res}% Ermässigung.</p><p class="discount">-${discount.toFixed(2)}</p></div> <p style=" font-size: 13px; font-weight: bold; margin-bottom: 1rem;">inkl. MwSt 7.7%<t</p></div> <div class="totalDisplay"><p>TOTAL</p> <p>${newTotal.toFixed(2)}</p></div>`;
            }
        }
    });
}

//Cheking the Form Values after proceeding to pay
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
    } else if (checkPlzAndOrtVals(plzOrt.value) == false) {
        // check if the field contains both mandatory information: postal code and city
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
        } else if (checkPlzAndOrtVals(plzOrtTwo.value) == false) {
            // check if the field contains both mandatory information: postal code and city
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
            openStripe();
            //alert("Derzeit nicht verfügbar, bitte stellen Sie Ihren Kauf in Rechnung")
        }
    }
}

// check if the field contains both mandatory information: postal code and city
function checkPlzAndOrtVals(str) {
  var result = str.split(" ")
  if (result.length == 1) {
  	return false
  } else {
  	var num = parseInt(result[0])
    return !isNaN(num)
  
  }
}

function createTicket() {
	var total = initialState.total
    //console.log("in the caaaaalll")
    if (initialState.discountTotal >= 0) {
		total = initialState.discountTotal
	}
    frappe.call({
            'method': 'lifefair.lifefair.tickets.create_ticket',
            'args': {
                'include_payment': initialState.stripe,
                'addressOne': initialState.addressOne,
                'addressTwo': initialState.addressTwo,
                'warenkorb': initialState.cart,
                'total': total,
                'source': initialState.source
            },
            'callback': function(response) {
                var res = response.message;

                initialState.ticketNum = (res.ticket_number);
                localStorage.setItem("TICKETS", JSON.stringify(initialState.ticketNum));
                
                initialState.sinv = (res.sinv_name);
                localStorage.setItem("SINV", JSON.stringify(initialState.sinv));
                
                initialState.signature = (res.signature);
                localStorage.setItem("SIGNATURE", JSON.stringify(initialState.signature));
                anlass = "ticketkauf"
                window.open(`/tickets?anlass=${anlass}`, "_self"); 
            }
        });
}


function openStripe(){
    //~ window.open("https://buy.stripe.com/test_14k8Az0qtbPC8KseUW", "_self");
    //~ createTicket();
    var stripeTotal = correctStripeValue();
    console.log("stripe total", stripeTotal)
    
    frappe.call({
        'method': "lifefair.lifefair.tickets.open_stripe",
        'args': {
                'total': stripeTotal
            },
        'callback': function (response) {
            var response = response.message
            console.log(response)
            window.open(response.url, "_blank"); 
        }
    })
}

function checkFloat(stringNum) {
	return stringNum.indexOf(".");
}

function correctStripeValue() {
  var total = initialState.total
  if (initialState.discountTotal >= 0) {
	total = initialState.discountTotal
  }
  var fixedTotal;
  var stringNum = total.toString();
  if ( checkFloat(stringNum) == -1 ) {
  	fixedTotal = parseInt(stringNum + "00");
    return fixedTotal
  } else {
	 
    splitValueString = stringNum.split(".")
    var floatTotal = splitValueString[0] + splitValueString[1]
    //console.log("is splitValueString", splitValueString)
    if (splitValueString[1].length == 1) {
       fixedTotal = parseInt(floatTotal + "0");
	} else {
		fixedTotal = parseInt(floatTotal);
	}
    //console.log("stripetotal", fixedTotal)
    return fixedTotal
  }
}

function loadVisitorTypes() {
    frappe.call({
        'method': "lifefair.lifefair.tickets.get_visitor_type",
        'callback': function (response) {
            visitor_types = response.message;
            
            var visitorDropdown = document.getElementById("dropdown");
            for (var i = 0; i < visitor_types.length; i++ ) {
                var visitor_li = document.createElement('li');
                visitor_li.innerHTML =`<button class="btnOrange" onclick="userSelection('${visitor_types[i]}', this)">${visitor_types[i]}</button>`;
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
            source: initialState.source,
            usertype: initialState.userTypeValue
        },
        'callback': function (response) {
            blocks = response.message;
            
            var blocksContainer = document.querySelector(".display");
            blocksContainer.innerHTML = "";
            var currentDate = null;
            blocks.forEach(function (block, x) {
                //console.log("blooooocks", block.official_title, "interests", block.interests);
                
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
                    
                    datumBtn.innerHTML += `<button class="btn widthBtn" onclick="filterDatum('${dayName}', this)">${dayName} ${date}</button>`
                    
                }
                
                addClass(card, dayNameForCard);
                card.innerHTML += `<div class='blockContainer'> <div class='blockTime'>  <div> ${block.short_name} </div><div> ${block.time}</div> </div> <p class='blockTitle'>  ${block.official_title} </p> <p class='blockText'>  ${block.location} </p><div>`;
                card.innerHTML += `<div class='buttonsContainer'> <a href="${block.website_link}" target="_blank" class='info'><img class='infoImg' src="/assets/lifefair/images/info.png"/></a> <div class='cart' onclick="addToCart(${x})"><img class='cartImg' src="/assets/lifefair/images/cart.png"/></div> </div>`;
                
                //creating the filter thema buttons and adding the class to the card
                if (block.interests) {
                    var blockInterest = block.interests.split(",");
                    blockInterest.forEach(function (interest) {
						//console.log("inters", interest)
                        var clean_interest =  purifyInterest(interest);
                        //console.log("clean_interest", clean_interest)
                        addClass(card, clean_interest);
                        if (interests.indexOf(interest) == -1) { 
                            interests.push(interest);
                            var themBtn = document.getElementById("filterBtnContainerTHEMA");
                            themBtn.innerHTML += `<button class="btn" onclick="filterSelection('${clean_interest}', this)">${interest}</button>`
                        }
                    });
                }
                
                //creating the filter Firma buttons and adding the class to the card
                //~ if (block.firmen) {
					//~ //console.log("firmaaa", block.firmen)
                    //~ var blockFirmen = block.firmen.split(",");
                    //~ blockFirmen.forEach(function (firma) {
						//~ //console.log("firma", firma)
                        //~ var clean_firma =  purifyInterest(firma);
                        //~ //console.log("clean_firma", clean_firma)
                        //~ addClass(card, clean_firma);
                        //~ if (firmen.indexOf(firma) == -1) { 
                            //~ firmen.push(firma);
                            //~ var firmaBtn = document.getElementById("filterBtnContainerFIRMA");
                            //~ firmaBtn.innerHTML += `<button class="btn" onclick="filterSelection('${clean_firma}', this)">${firma}</button>`
                        //~ }
                    //~ });
                //~ }
                
                if (block.time) {
                    var twoTimeRange = block.time.split("und");
                    
                    if (twoTimeRange.length > 1) {
                        for (var i = 0; i < twoTimeRange.length; i++ ) {
                            var OnetimeRange = twoTimeRange[i].split("-");
                            if (OnetimeRange.length > 1) {
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
                        }
                    } else {
                            var OnetimeRange = block.time.split("-");
                            var timeFilter = checkTime(OnetimeRange);
                            if (OnetimeRange.length > 1) {
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
    initialState.stripe = 0;
    localStorage.setItem("STRIPE", JSON.stringify(initialState.stripe));
    initialState.discountTotal = -1;
    localStorage.setItem("NEWTOTAL", JSON.stringify(initialState.discountTotal));
    
    var country_option = document.getElementById("inputLand");
    getCountries(country_option)
    
    document.getElementById("step1").style.display = "block";
    document.querySelector(".warenkorbBtn").style.display = "block";
    document.getElementById("warenkorb").style.display = "block";
    document.getElementById("warenkorb").classList.remove("grey");
    cartbButton.innerHTML = `<p class="cartBtnText" onclick="checkDataAndPay()">JETZT KAUFEN</p>`;
    
    if ( initialState.rechCheck == "Yes" ) {

        var country_option = document.getElementById("inputLandTwo");
        getCountries(country_option, initialState.addressTwo.land)
        
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
        //landTwo.value = initialState.addressTwo.land;
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
    document.querySelector(".warenkorbBtn").style.display = "none";
    document.getElementById("step3").style.display = "block";
    
    initialState.stripe = 1;
    localStorage.setItem("STRIPE", JSON.stringify(initialState.stripe));
    createTicket();
}

function loadEndMsg() {
    document.getElementById("step0").style.display = "none";
    document.getElementById("warenkorb").style.display = "none";
    document.getElementById("step1").style.display = "none";
    document.querySelector(".warenkorbBtn").style.display = "none";
    document.getElementById("step3").style.display = "block";
    anlass = initialState.meeting;

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
            if (OnetimeRange.length > 1) {
                var timeFilter = checkTime(OnetimeRange);
                if (timeFilter[0] == 1) {
                    initialState.info.push("Networking-Lunch inklusiv am " + infoDayName);
                } else if ( timeFilter[0] == 2){
                    initialState.info.push("Networking-Apéro inklusiv am " + infoDayName);
                } else {
                    initialState.info.push(" ");
                }
            }
        } 
        if (initialState.info[x] != " ") {
            endMsgContainer.innerHTML += `<div class="infoDiv innerInfoDiv infoDetails"> ${initialState.info[x]} </div>`;
        }
    }

    endMsgContainer.innerHTML += `
        <div class="infoDiv innerInfoDiv infoDetails">Übernachtung empfohlen. &nbsp;&nbsp; <a href="https://sges.ch/official-congress-hotel-2022/" target="_blank" class="hotelLink"> PARKHOTEL-LINK </a></div>
        <div class="endMsgButtonsContainer">
        <a href="/api/method/erpnextswiss.erpnextswiss.guest_print.get_pdf_as_guest?doctype=Sales Invoice&name=${initialState.sinv}&key=${initialState.signature}&format=Sales Invoice - Ticket&no_letterhead=0" target="_blank" class="endMsgBtn downloadBtn">TICKET / RECHNUNG HERUNTERLADEN</a>
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
    var currentURL = window.location.href;

	// Check if the website is opened from sges.ch or how.ch
	if (currentURL.includes('localhost:8000')) { //sges.ch
	  currentURL += (currentURL.includes('?') ? '&' : '?') + 'source=how'; //'source=sges'
	} else if (currentURL.includes('how.ch')) {
	  currentURL += (currentURL.includes('?') ? '&' : '?') + 'source=how';
	}
	
	if (currentURL.includes('source'))  {
		// Create a URLSearchParams object from the URL
		var urlParams = new URLSearchParams(currentURL);
		if (urlParams.has("source")) {
			// Get the value of the "source" parameter
			var sourceValue = urlParams.get("source");
			initialState.source = (sourceValue);
			localStorage.setItem("SOURCE", JSON.stringify(initialState.source));
		} 
	} else {
	  window.location.href = currentURL;
	}

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
