let account;
window.addEventListener('load', async () => {

      // Initialize Web3
      
      //var Web3 = require('web3');
		var provider = 'https://goerli.infura.io/v3/e467be09bee444168d832b9af12496db';
		var web3Provider = new Web3.providers.HttpProvider(provider);
		var web3 = new Web3(web3Provider);
		web3.eth.getBlockNumber().then((result) => {
		console.log("Latest Ethereum Block is ",result);
		});

    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        account = accounts[0];
      }
    });
  
  // Initialize the Smart Contract
  const contractAddress = '0x87f823C82f615429E2d72b329DD8a6641040B533'; // Replace with the actual contract address
  const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_brand",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_review",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_rating",
				"type": "uint256"
			}
		],
		"name": "addReview",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_brand",
				"type": "string"
			}
		],
		"name": "getRating",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_brand",
				"type": "string"
			}
		],
		"name": "getReviews",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "brand",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "review",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "rating",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "reviewer",
						"type": "string"
					}
				],
				"internalType": "struct ReviewPlatform.Review[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUser",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "isRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

;

window.web3 = new Web3(window.ethereum);
window.contract = new window.web3.eth.Contract(contractABI, contractAddress);

// Add Review function
async function addReview() {
const brand = document.getElementById("brand").value;
const review = document.getElementById("review").value;
const rating = document.getElementById("rating").value;

const isReg = await window.contract.methods.isRegistered(account).call({ from: account });
//console.log("___"+JSON.stringify(isReg)+"___");

if(!isReg){
    alert("Please register first!");
    return;
    }


await window.contract.methods.addReview(brand, review, rating).send({ from: account });
alert("Review added successfully!");

  // Calculate the reward amount based on the length of the review
  const rewardAmount = web3.utils.toWei((review.length * 0.0001).toString(), "ether");

  // Transfer the reward to the user's address
  //await window.contract.methods.transfer(account, rewardAmount).send({ from: account });

  //alert("Review added successfully! You have received a reward of " + web3.utils.fromWei(rewardAmount, "ether") + " ETH.");

}

// View Reviews function
async function viewReviews() {
    var reviewsList = document.getElementById("reviews-list");
    reviewsList.innerHTML = "";
var brandName = document.getElementById("brandSelect").value;


const reviews = await window.contract.methods.getReviews(brandName).call();
console.log(reviews);
if (reviews.length === 0) {
    reviewsList.innerHTML = "No reviews found for this brand.";
return;
}else{    
    rate = await window.contract.methods.getRating(brandName).call();
    // Create a new HTML element for the text
    console.log("rate: " + rate);

    console.log(reviewsList);

    var reviewsList = document.getElementById("reviews-list");
    reviewsList.innerHTML = "";
    var averageRatingElement = document.createElement("p");
    averageRatingElement.innerHTML = 'Average Rating: ' + rate;
    reviewsList.appendChild(averageRatingElement);


        // Display the reviews in an unordered list
        var reviewsUl = document.createElement("ul");
        for (var i = 0; i < reviews.length; i++) {
        var result = reviews[i];
        console.log(result);
        var reviewer = result.reviewer;
        if (reviewer == "") {
            reviewer = "username undefined";
        }

        var reviewLi = document.createElement("li");
        reviewLi.innerHTML =
            "<strong>" +
            reviewer +
            ":</strong> " +
            result.review +
            " (" +
            result.rating +
            " stars)";
        reviewsUl.appendChild(reviewLi);
        }
        reviewsList.appendChild(reviewsUl);
}

//reviewsDiv.innerHTML = brandReviews;
}

// Register User function
async function registerUser() {
const name = document.getElementById("name").value;
const isReg = await window.contract.methods.isRegistered(account).call({ from: account });
//console.log("___"+JSON.stringify(isReg)+"___");

if(!isReg){
    await window.contract.methods.registerUser(name).send({ from: account });
    alert("User registered successfully!");
    }
else{
    alert("User already registered!");
    }
}

// Get User Information function
async function getUserInfo() {
const userInfoDiv = document.getElementById("userInfo");
userInfoDiv.innerHTML = "";

const user = await window.contract.methods.getUser().call({ from: account });
console.log(user);
let html = "";
if (user!="") {
html += "Name: " + user + "<br>";
} else {
html += "User not registered.";
}

userInfoDiv.innerHTML = html;
}