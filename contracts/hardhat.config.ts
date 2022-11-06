import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:7545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '3610f042305b5bca24fb08e45cce1160a437e2a08f3790a2240be2093a4f93b1',
        '97ba75921ae0f90c31a141021a7ac67a8665ed6a01d8442c1b488ea0992f46eb',
        '941ccf51f8031f4fa77acbcdad0c0c0fcc4fa251ff2cc8cd820e4a747f8e29fe'
      ]
    },
  },
};

export default config;
