'use client';

import { useState } from 'react';
import { GasFreeCrypto, WalletData, Transaction, CustomToken } from '@/lib/gasfree-crypto';

export default function Home() {
  const [crypto] = useState(() => new GasFreeCrypto());
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [balance, setBalance] = useState<{ baseCoin: number; customTokens: CustomToken[] } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');

  const createWallet = async () => {
    setLoading(true);
    try {
      const newWallet = await crypto.createWallet();
      setWallet(newWallet);
      await updateBalance();
      await updateTransactions();
    } catch (error) {
      alert(`Error creating wallet: ${error}`);
    }
    setLoading(false);
  };

  const updateBalance = async () => {
    try {
      const balanceData = await crypto.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const updateTransactions = async () => {
    try {
      const txHistory = await crypto.getTransactionHistory();
      setTransactions(txHistory);
    } catch (error) {
      console.error('Error updating transactions:', error);
    }
  };

  const sendTokens = async () => {
    if (!sendAmount || !sendAddress) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const txId = await crypto.sendTokens(sendAddress, parseFloat(sendAmount));
      alert(`Transaction sent! ID: ${txId}`);
      setSendAmount('');
      setSendAddress('');
      await updateBalance();
      await updateTransactions();
    } catch (error) {
      alert(`Error sending tokens: ${error}`);
    }
    setLoading(false);
  };

  const createToken = async () => {
    if (!tokenName || !tokenSymbol || !tokenSupply) {
      alert('Please fill in all token details');
      return;
    }

    setLoading(true);
    try {
      const token = await crypto.createCustomToken(
        tokenName,
        tokenSymbol,
        parseFloat(tokenSupply)
      );
      alert(`Token created! ${token.name} (${token.symbol})`);
      setTokenName('');
      setTokenSymbol('');
      setTokenSupply('');
      await updateBalance();
    } catch (error) {
      alert(`Error creating token: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            RUACH
          </h1>
          <p className="text-2xl text-gray-300 mb-2">Gas-Free Cryptocurrency</p>
          <p className="text-lg text-green-400 font-semibold">✨ ZERO TRANSACTION FEES ✨</p>
        </div>

        {!wallet ? (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Your Wallet</h2>
            <button
              onClick={createWallet}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 
                         disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold 
                         transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Creating...' : 'Create Gas-Free Wallet'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                💼 Your Wallet
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm">Address:</p>
                  <p className="font-mono text-sm bg-black/30 p-2 rounded break-all">
                    {wallet.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Balance:</p>
                  <p className="text-3xl font-bold text-green-400">
                    {balance?.baseCoin || 0} RUACH
                  </p>
                </div>
                {balance?.customTokens && balance.customTokens.length > 0 && (
                  <div>
                    <p className="text-gray-300 text-sm">Custom Tokens:</p>
                    <div className="space-y-2">
                      {balance.customTokens.map((token) => (
                        <div key={token.id} className="bg-black/30 p-2 rounded">
                          <p className="font-semibold">{token.name} ({token.symbol})</p>
                          <p className="text-sm text-gray-400">Supply: {token.totalSupply}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Send Tokens */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                🚀 Send Tokens (No Fees!)
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 
                           placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 
                           placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={sendTokens}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 
                           disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold 
                           transition-all duration-200"
                >
                  {loading ? 'Sending...' : 'Send (Fee: 0 RUACH)'}
                </button>
              </div>
            </div>

            {/* Create Token */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                🪙 Create Custom Token
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Token Name"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 
                           placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  placeholder="Token Symbol"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 
                           placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="number"
                  placeholder="Total Supply"
                  value={tokenSupply}
                  onChange={(e) => setTokenSupply(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 
                           placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={createToken}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                           disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold 
                           transition-all duration-200"
                >
                  {loading ? 'Creating...' : 'Create Token (Fee: 0 RUACH)'}
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                📋 Transaction History
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No transactions yet</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="bg-black/30 p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          tx.type === 'sent' ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'
                        }`}>
                          {tx.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-mono text-sm">{tx.amount} RUACH</p>
                      <p className="text-xs text-green-400">Fee: {tx.fee} RUACH (ZERO!)</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Network Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
          <h3 className="text-xl font-bold mb-2">🌐 Network Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Network</p>
              <p className="font-semibold">RUACH Tangle</p>
            </div>
            <div>
              <p className="text-gray-400">Transaction Fee</p>
              <p className="font-semibold text-green-400">0 RUACH</p>
            </div>
            <div>
              <p className="text-gray-400">Token Creation Fee</p>
              <p className="font-semibold text-green-400">0 RUACH</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-semibold text-green-400">✅ Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
