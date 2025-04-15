import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);

  const [account, setAccount] = useState(null);

  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);
  const [balance, setBalance] = useState(100);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    const realEstate = new ethers.Contract(
      config[network.chainId].realEstate.address,
      RealEstate,
      provider
    );
    const totalSupply = await realEstate.totalSupply();
    const homes = [];

    for (var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      homes.push(metadata);
    }

    setHomes(homes);

    const escrow = new ethers.Contract(
      config[network.chainId].escrow.address,
      Escrow,
      provider
    );
    setEscrow(escrow);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);

      // Fetch and log the balance of the account
      const balance = await provider.getBalance(account);
      console.log("Account Balance:", ethers.utils.formatEther(balance), "ETH");
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const togglePop = (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };

  // Static home data for demonstration
  const staticHomes = [
    {
      id: 1,
      name: "Cozy Cottage",
      image:
        "https://images.homify.com/v1520224068/p/photo/image/2462141/DSC00003.jpg",
      attributes: [
        { trait_type: "Price", value: "2.5" }, // Price in ETH
        { trait_type: "Type", value: "Cottage" },
        { trait_type: "Bedrooms", value: "3" },
        { trait_type: "Bathrooms", value: "2" },
        { trait_type: "Square Footage", value: "1500" },
      ],
      address: "123 Main St, Springfield, USA",
      description: "A cozy cottage perfect for small families.",
    },
    {
      id: 2,
      name: "Modern Villa",
      image:
        "https://static.asianpaints.com/content/dam/asianpaintsbeautifulhomes/202303/indian-house-colour-combination/title-best-exterior-colour-combination.jpg.transform/bh-tb-image-container/image.webp",
      attributes: [
        { trait_type: "Price", value: "3.8" },
        { trait_type: "Type", value: "Villa" },
        { trait_type: "Bedrooms", value: "4" },
        { trait_type: "Bathrooms", value: "3" },
        { trait_type: "Square Footage", value: "2000" },
      ],
      address: "456 Elm St, Metropolis, USA",
      description: "A luxurious villa with modern amenities.",
    },
    {
      id: 3,
      name: "Compact Apartment",
      image:
        "https://cdn.buildofy.com/projects/443731c2-e5e5-4b3e-a212-9ae14ace0dc9.jpeg",
      attributes: [
        { trait_type: "Price", value: "1.2" },
        { trait_type: "Type", value: "Apartment" },
        { trait_type: "Bedrooms", value: "2" },
        { trait_type: "Bathrooms", value: "1" },
        { trait_type: "Square Footage", value: "900" },
      ],
      address: "789 Oak St, Smallville, USA",
      description: "A compact apartment ideal for singles or couples.",
    },
    {
      id: 4,
      name: "Spacious Mansion",
      image:
        "https://futurestiles.com/wp-content/uploads/2024/11/Black-Elegant-Interior-Design-Presentation-2024-11-23T180733.813-1-1024x576.jpg",
      attributes: [
        { trait_type: "Price", value: "4.5" },
        { trait_type: "Type", value: "Mansion" },
        { trait_type: "Bedrooms", value: "5" },
        { trait_type: "Bathrooms", value: "4" },
        { trait_type: "Square Footage", value: "3000" },
      ],
      address: "101 Pine St, Gotham, USA",
      description: "A spacious mansion with a beautiful garden.",
    },
    {
      id: 5,
      name: "Family Home",
      image:
        "https://media.istockphoto.com/id/2155879397/photo/house-in-a-charming-neighborhood-with-stunning-sidewalk-landscaping.jpg?s=612x612&w=0&k=20&c=nQJOUoNb2RNev3QVNjIohcmxQABCTetCdgfnc8MV8sU=",
      attributes: [
        { trait_type: "Price", value: "2.0" },
        { trait_type: "Type", value: "House" },
        { trait_type: "Bedrooms", value: "3" },
        { trait_type: "Bathrooms", value: "2" },
        { trait_type: "Square Footage", value: "1200" },
      ],
      address: "202 Maple St, Star City, USA",
      description: "A perfect family home in a quiet neighborhood.",
    },
  ];

  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    if (!storedBalance) {
      localStorage.setItem("balance", 100);
    } else {
      setBalance(parseFloat(storedBalance));
    }
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} balance={balance} />
      <Search />

      <div className="cards__section">
        <h3>Homes For You</h3>

        <hr />

        <div className="cards">
          {staticHomes.map((home, index) => (
            <div className="card" key={index} onClick={() => togglePop(home)}>
              <div className="card__image">
                <img src={home.image} alt="Home" />
              </div>
              <div className="card__info">
                <h4>{home.attributes[0].value} ETH</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p>{home.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          togglePop={togglePop}
          setBalance={setBalance}
          balance={balance}
        />
      )}
    </div>
  );
}

export default App;
