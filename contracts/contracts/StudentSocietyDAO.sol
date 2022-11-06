// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
import "hardhat/console.sol";
import "./MyERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract StudentSocietyDAO {

    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    uint256 constant public VOTE_FEE = 500;
    uint256 constant public LAUNCH_FEE = 2000;
    uint256 constant public BONUS = 2500;

    struct Proposal {
        uint32 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        string name;       // proposal name
        string discription; //detailed discription of the proposal
        uint32 approveCount;
        uint32 disapproveCount;
        bool commited;
    }

    MyERC20 public studentERC20;
    mapping(uint32 => Proposal) Proposals; // A map from proposal index to proposal
    mapping (uint32 => mapping (address => bool)) voteRecords;
    mapping (address => uint32[]) launchRecords;
    uint32 proposalCount;

    constructor() {
        // maybe you need a constructor
        studentERC20 = new MyERC20("name", "symbol");
        proposalCount = 0;
    }

    function vote(uint32 index, bool approve) public {
        require(index < proposalCount, "This proposal does not exist.");
        require(voteRecords[index][msg.sender] == false, "You can only vote once.");
        require(Proposals[index].commited == false, "The voting for this proposal has ended.");
        
        if(approve)
            Proposals[index].approveCount++;
        else 
            Proposals[index].disapproveCount++;
            
        studentERC20.transferFrom(msg.sender, address(this), VOTE_FEE);
        voteRecords[index][msg.sender] = true;
    }

    function commit(uint32 index)  public {
        require(Proposals[index].commited == false);
        Proposals[index].commited = true;
        if (Proposals[index].approveCount > Proposals[index].disapproveCount) {
            studentERC20.transfer(Proposals[index].proposer, BONUS);
        }
    }

    function launch(uint256 start, uint256 duration, string calldata name, string calldata detail)  public {
        studentERC20.transferFrom(msg.sender, address(this), LAUNCH_FEE);
        Proposal memory proposal = Proposal(proposalCount, msg.sender, start, duration, name, detail, 0, 0, false);
        Proposals[proposalCount] = proposal;
        launchRecords[msg.sender].push(proposalCount);
        proposalCount++;
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }


    function getProposalCount() view public returns (uint32) {
        return proposalCount;
    }

    function getProposal(uint32 index) public view returns (Proposal memory) {
        return Proposals[index];
    }

    function getMyProposal() public view returns (uint32[] memory) {
        return launchRecords[msg.sender];
    }
}
