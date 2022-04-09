//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract CampaignFactory {
    Campaign[] public campaignAddresses;

    event campaignCreated(
        string title,
        uint256 requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imgURI,
        uint256 indexed timestamp
    );

    function createCampaign(
        string memory _title,
        uint256 _requiredAmount,
        string memory imgURI,
        string memory storyURI
    ) public {
        Campaign newCampaign = new Campaign(
            _title,
            _requiredAmount,
            imgURI,
            storyURI,
            msg.sender
        );

        campaignAddresses.push(newCampaign);

        emit campaignCreated(
            _title,
            _requiredAmount,
            msg.sender,
            address(newCampaign),
            imgURI,
            block.timestamp
        );
    }

    function getAll() public view returns (Campaign[] memory) {
        return campaignAddresses;
    }
}

contract Campaign {
    string public title = "Campaign Test";
    uint256 public requiredAmount;
    string public image;
    string public story;
    address payable public owner;
    uint256 public recievedAmount;
    mapping(address => uint256) donators;
    mapping(uint256 => address) donatorsAddress;
    uint256 donatorCount = 1;

    event donated(
        address indexed donar,
        uint256 indexed amount,
        uint256 indexed timestamp
    );

    constructor(
        string memory _title,
        uint256 _requiredAmount,
        string memory imgURI,
        string memory storyURI,
        address _owner
    ) payable {
        title = _title;
        requiredAmount = _requiredAmount;
        image = imgURI;
        story = storyURI;
        owner = payable(_owner);
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function donate() public payable {
        require(requiredAmount > recievedAmount, "Rquired amount fulfilled");
        if (recievedAmount == requiredAmount) {
            releaseFunds();
        }

        if (donators[owner] == 0) {
            donators[owner] += msg.value;
            donatorsAddress[donatorCount++] = owner;
        } else {
            donators[owner] += msg.value;
        }

        // owner.transfer(msg.value);
        recievedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public payable {
        for (uint256 i = 1; i <= donatorCount; i++) {
            if (donatorsAddress[i] == msg.sender) {
                address _to = donatorsAddress[i];
                uint256 _amount = donators[_to];
                payable(_to).transfer(_amount);

                donators[msg.sender] = 0;
                donatorsAddress[i] = address(0);
                recievedAmount -= _amount;
                break;
            }
        }
    }

    function releaseFunds() public payable {
        payable(owner).transfer(requiredAmount);
    }
}
