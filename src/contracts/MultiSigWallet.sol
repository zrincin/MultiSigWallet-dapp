//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract MultiSigWallet {
    address[] public owners;
    uint256 public limit;
    uint256 public nextID;

    struct TransferRequest {
        uint256 ID;
        uint256 amount;
        address payable to;
        uint256 approvals;
        bool isSent;
    }

    mapping(address => uint256) public balances;
    mapping(uint256 => TransferRequest) public transfers;
    mapping(address => mapping(uint256 => bool)) public isApproved;

    event TransferRequestCreation(
        uint256 ID,
        uint256 amount,
        address creator,
        address beneficiary
    );
    event ApprovalReception(uint256 ID, uint256 approvals, address approver);
    event TransferRequestApproval(uint256 ID);

    modifier onlyOwner() {
        bool isOwner = false;
        for (uint256 i; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                isOwner = true;
            }
        }
        require(isOwner == true, "Only owners allowed");
        _;
    }

    constructor(address[] memory _owners, uint256 _limit) {
        owners = _owners;
        limit = _limit;
    }

    receive() external payable {
        depositFunds();
    }

    function depositFunds() public payable {
        balances[msg.sender] += msg.value;
    }

    function getBalance()
        public
        view
        onlyOwner
        returns (uint256 contractBalance)
    {
        return address(this).balance;
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function createTransferRequest(uint256 _amount, address payable _to)
        external
        onlyOwner
    {
        require(getBalance() >= _amount, "Amount exceeds the contract balance");

        emit TransferRequestCreation(nextID, _amount, msg.sender, _to);

        transfers[nextID] = TransferRequest(nextID, _amount, _to, 0, false);
        nextID++;
    }

    function approveTransferRequest(uint256 _ID) external payable onlyOwner {
        require(
            transfers[_ID].isSent == false,
            "Transfer has already been sent"
        );
        require(isApproved[msg.sender][_ID] == false);

        isApproved[msg.sender][_ID] = true;
        transfers[_ID].approvals++;

        emit ApprovalReception(_ID, transfers[_ID].approvals, msg.sender);

        if (transfers[_ID].approvals >= limit) {
            transfers[_ID].isSent = true;
            address payable to = transfers[_ID].to;
            uint256 amount = transfers[_ID].amount;
            to.transfer(amount);
            emit TransferRequestApproval(_ID);
        }
    }
}
