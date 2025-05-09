
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CryptoAsset } from '../store/cryptoSlice';
import { formatCurrency, formatLargeNumber, formatPercentage, getPercentageColorClass } from '../utils/formatters';
import MiniChart from './MiniChart';
import { Coins } from 'lucide-react';

interface CryptoCardProps {
  asset: CryptoAsset;
  lastUpdatedField: string | null;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ asset, lastUpdatedField }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  // Determine the 7-day trend
  const sevenDayTrend = asset.priceChange.sevenDays >= 0 ? 'up' : 'down';

  return (
    <div 
      className="bg-card rounded-lg border border-border p-4 mb-4 cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={() => navigate(`/coin/${asset.id}`)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-muted-foreground mr-2">#{asset.rank}</span>
          {imageError ? (
            <div className="w-6 h-6 bg-secondary flex items-center justify-center rounded-full mr-2">
              <Coins className="w-4 h-4 text-primary" />
            </div>
          ) : (
            <img 
              src={asset.logo} 
              alt={asset.name} 
              className="w-6 h-6 mr-2" 
              onError={() => setImageError(true)}
            />
          )}
          <div>
            <span className="font-medium">{asset.name}</span>
            <span className="ml-2 text-muted-foreground text-xs">{asset.symbol}</span>
          </div>
        </div>
        <div className="flex items-center">
          <MiniChart 
            data={asset.chartData} 
            trend={sevenDayTrend} 
            className="w-20 h-10"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-muted-foreground">Price</span>
        <span className={lastUpdatedField === 'price' ? 'animate-pulse-price' : ''}>
          {formatCurrency(asset.price)}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-1 bg-secondary rounded">
          <div className="text-xs text-muted-foreground">1h %</div>
          <div className={getPercentageColorClass(asset.priceChange.oneHour)}>
            {formatPercentage(asset.priceChange.oneHour)}
          </div>
        </div>
        <div className="text-center p-1 bg-secondary rounded">
          <div className="text-xs text-muted-foreground">24h %</div>
          <div className={getPercentageColorClass(asset.priceChange.oneDay)}>
            {formatPercentage(asset.priceChange.oneDay)}
          </div>
        </div>
        <div className="text-center p-1 bg-secondary rounded">
          <div className="text-xs text-muted-foreground">7d %</div>
          <div className={getPercentageColorClass(asset.priceChange.sevenDays)}>
            {formatPercentage(asset.priceChange.sevenDays)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-muted-foreground">Market Cap</div>
          <div className="text-sm truncate">{formatLargeNumber(asset.marketCap)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">24h Volume</div>
          <div className={`text-sm truncate ${lastUpdatedField === 'volume' ? 'animate-pulse-price' : ''}`}>
            {formatLargeNumber(asset.volume24h)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Circulating Supply</div>
          <div className="text-sm truncate">{formatLargeNumber(asset.circulatingSupply)} {asset.symbol}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Max Supply</div>
          <div className="text-sm truncate">
            {asset.maxSupply ? formatLargeNumber(asset.maxSupply) : '∞'} {asset.symbol}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
