// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EVault {
    struct Document {
        uint id;
        address owner;
        string hash;
        string name;
        uint timestamp;
    }

    uint public documentCount = 0;
    mapping(uint => Document) public documents;

    event DocumentUploaded(
        uint id,
        address owner,
        string hash,
        string name,
        uint timestamp
    );

    function uploadDocument(string memory _hash, string memory _name) public {
        require(bytes(_hash).length > 0, "Hash is required");
        require(bytes(_name).length > 0, "Name is required");

        documentCount++;
        documents[documentCount] = Document(documentCount, msg.sender, _hash, _name, block.timestamp);
        emit DocumentUploaded(documentCount, msg.sender, _hash, _name, block.timestamp);
    }

    function getDocument(uint _id) public view returns (Document memory) {
        return documents[_id];
    }
}
