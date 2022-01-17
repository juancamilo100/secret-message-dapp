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
      $.getJSON('build/contracts/Message.json', function(data) {
          console.log("Getting contract!");
          console.log(data);
          // Get the necessary contract artifact file and instantiate it with @truffle/contract
          var MessageArtifact = data;
          App.contracts.Message = TruffleContract(MessageArtifact);
          console.log("here it is!");
          console.log(App.contracts.Message);
        
          // Set the provider for our contract
          App.contracts.Message.setProvider(App.web3Provider);
        
          // Use our contract to retrieve and mark the adopted pets
          return 1;
      });
  
      return App.bindEvents();
    },
  
    bindEvents: function() {
      $(document).on('click', '.btn-sendMessage', App.sendMessage);
    },
  
    sendMessage: function(event) {
        console.log("Sending message!");
      event.preventDefault();
  
    //   var message = parseInt($(event.target).data('message'));
      var secretMessage = $("#userInput").val();
  
      var messageInstance;
  
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0];
      
        App.contracts.Message.deployed().then(async (instance) => {
          messageInstance = instance;
            
          const currentMessage = await messageInstance.getMessage();
          console.log('currentMessage');
          console.log(currentMessage);
          console.log('Setting message...');
          // Execute adopt as a transaction by sending account
          return messageInstance.setMessage(secretMessage, {from: account});
        }).then(async (result) => {
            const currentMessage = await messageInstance.getMessage();
            console.log("Updated message:");
            console.log(currentMessage);
            console.log('Message set successfully');
          return secretMessage;
        }).catch(function(err) {
          console.log(err.message);
        });
      });    
    }
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  