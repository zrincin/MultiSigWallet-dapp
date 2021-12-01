import web3 from "./web3";

const MSW_ADDR = "0x9deb7180E3ad18Ea1F5f4316Badf76c2b7876981";

const MSW_ABI = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "approvals",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ApprovalReception",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
    ],
    name: "TransferRequestApproval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "TransferRequestCreation",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isApproved",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "limit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "owners",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transfers",
    outputs: [
      {
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "approvals",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isSent",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    stateMutability: "payable",
    type: "receive",
    payable: true,
  },
  {
    inputs: [],
    name: "depositFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "contractBalance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getOwners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getTransfers",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ID",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "approvals",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isSent",
            type: "bool",
          },
        ],
        internalType: "struct MultiSigWallet.TransferRequest[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
    ],
    name: "createTransferRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ID",
        type: "uint256",
      },
    ],
    name: "approveTransferRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default new web3.eth.Contract(MSW_ABI, MSW_ADDR);
