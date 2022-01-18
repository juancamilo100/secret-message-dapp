App = {
    web3Provider: null,
    contracts: {},
  
    init: async function() {
        console.log("Initializing app....");
    
        return await App.initWeb3();
    },
  
    initWeb3: async function() {
      // Modern dapp browsers...
      if (window.ethereum) {
          App.web3Provider = window.ethereum;
          try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });;
          } catch (error) {
          // User denied account access...
          console.error("User denied account access")
          }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
  
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON('Message.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with @truffle/contract
          var MessageArtifact = data;
          App.contracts.Message = TruffleContract(MessageArtifact);
        
          // Set the provider for our contract
          App.contracts.Message.setProvider(App.web3Provider);
        
          // Use our contract to retrieve and mark the adopted pets
          return;
      });
  
      return App.bindEvents();
    },
  
    bindEvents: function() {
      $(document).on('click', '.btn-sendMessage', App.sendMessage);
      $(document).on('click', '.btn-getMessage', App.getMessage);
    },

    getMessage: async function(event) {
        event.preventDefault();

        const instance = await App.contracts.Message.deployed();

        const currentMessage = await instance.getMessage();
        console.log("The current secret message is:");
        console.log(currentMessage);
    },
  
    sendMessage: async function(event) {
        event.preventDefault();
    
        const secretMessage = $("#userInput").val();
  
        web3.eth.getAccounts(async function(error, accounts) {
            if (error) {
            console.log(error);
            }
        
            var account = accounts[0];
        
            try {
                const instance = await App.contracts.Message.deployed()
                // Execute adopt as a transaction by sending account
                await instance.setMessage(secretMessage, {from: account});
            } catch (err) {
                console.log(err.message);
            }
        });    
    }
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  