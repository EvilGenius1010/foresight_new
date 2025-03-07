#!/bin/bash

solana-test-validator &
sleep 10 # Wait for validator to start
sudo anchor deploy &
npm run dev
