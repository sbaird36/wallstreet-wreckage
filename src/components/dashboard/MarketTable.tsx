"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { ChangeIndicator } from "@/components/ui/ChangeIndicator";
import { SectorBadge, TypeBadge } from "@/components/ui/Badge";
import { AssetSignals } from "@/components/dashboard/AssetSignals";
import { getPriceChangePercent } from "@/utils/calculations";
import { formatPrice } from "@/utils/formatting";
import type { Asset, Sector } from "@/types";

type Tab = "stocks" | "crypto";
type SortKey = "name" | "price" | "change";

const PAGE_SIZE = 15;

export function MarketTable() {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState<Tab>("stocks");
  const [sort, setSort] = useState<SortKey>("change");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [sectorFilter, setSectorFilter] = useState<Sector | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const allAssets = Object.values(state.assets);

  const availableSectors = useMemo(() => {
    const sectors = new Set<Sector>();
    allAssets.forEach((a) => {
      if (a.type === "stock") sectors.add(a.sector);
    });
    return Array.from(sectors).sort();
  }, [allAssets]);

  const sorted = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = allAssets.filter((a) => {
      if (tab === "stocks") {
        if (a.type !== "stock") return false;
        if (sectorFilter && a.sector !== sectorFilter) return false;
      } else {
        if (a.type !== "crypto") return false;
      }
      if (q) {
        return a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.ticker.localeCompare(b.ticker) * sortDir;
      if (sort === "price") return (a.currentPrice - b.currentPrice) * sortDir;
      return (getPriceChangePercent(a) - getPriceChangePercent(b)) * sortDir;
    });
  }, [allAssets, tab, sectorFilter, sort, sortDir, search]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSlice = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sort === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSort(key);
      setSortDir(-1);
    }
    setPage(1);
  }

  function handleTabChange(t: Tab) {
    setTab(t);
    setSectorFilter(null);
    setSearch("");
    setPage(1);
  }

  function handleSectorChange(sector: Sector | null) {
    setSectorFilter(sector);
    setPage(1);
  }

  function handleQuickBuy(asset: Asset) {
    dispatch({
      type: "SET_PENDING_TRADE",
      payload: {
        ticker: asset.ticker,
        action: "BUY",
        quantity: 1,
        pricePerUnit: asset.currentPrice,
      },
    });
  }

  const SortHeader = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <th
      className="text-right pb-2 cursor-pointer hover:text-gray-200 transition-colors select-none"
      onClick={() => handleSort(keyName)}
    >
      {label}
      {sort === keyName && <span className="ml-1">{sortDir === -1 ? "↓" : "↑"}</span>}
    </th>
  );

  const startRow = (safePage - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(safePage * PAGE_SIZE, sorted.length);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs text-gray-400 uppercase tracking-wider">Market</h2>
        <div className="flex gap-1">
          <button
            onClick={() => handleTabChange("stocks")}
            className={`text-xs px-3 py-1 rounded border transition-colors ${
              tab === "stocks"
                ? "bg-gray-700 border-gray-500 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => handleTabChange("crypto")}
            className={`text-xs px-3 py-1 rounded border transition-colors ${
              tab === "crypto"
                ? "bg-amber-900 border-amber-700 text-amber-300"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            Crypto
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search ticker or name…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 font-mono"
        />
      </div>

      {/* Sector filter pills — stocks only */}
      {tab === "stocks" && (
        <div className="flex flex-wrap gap-1 mb-3">
          <button
            onClick={() => handleSectorChange(null)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              sectorFilter === null
                ? "bg-gray-600 border-gray-500 text-white"
                : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
            }`}
          >
            All
          </button>
          {availableSectors.map((sector) => (
            <button
              key={sector}
              onClick={() => handleSectorChange(sectorFilter === sector ? null : sector)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                sectorFilter === sector
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th
                className="text-left pb-2 cursor-pointer hover:text-gray-200 transition-colors select-none"
                onClick={() => handleSort("name")}
              >
                Ticker {sort === "name" && (sortDir === -1 ? "↓" : "↑")}
              </th>
              <th className="text-left pb-2 hidden md:table-cell">Sector</th>
              <SortHeader label="Price" keyName="price" />
              <SortHeader label="Change" keyName="change" />
              <th className="text-right pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {pageSlice.map((asset) => {
              const changePct = getPriceChangePercent(asset);
              const href =
                asset.type === "stock"
                  ? `/stock/${asset.ticker}`
                  : `/crypto/${asset.ticker}`;

              return (
                <tr
                  key={asset.ticker}
                  className="hover:bg-gray-800/40 transition-colors"
                >
                  <td className="py-2">
                    <Link href={href} className="group">
                      <div className="font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                        {asset.ticker}
                      </div>
                      <div className="text-gray-500 text-xs truncate max-w-[120px]">
                        {asset.name}
                      </div>
                    </Link>
                    <AssetSignals asset={asset} />
                  </td>
                  <td className="py-2 hidden md:table-cell">
                    {asset.type === "stock" ? (
                      <SectorBadge sector={asset.sector} />
                    ) : (
                      <TypeBadge type="crypto" />
                    )}
                  </td>
                  <td className="text-right py-2 font-mono text-white tabular-nums">
                    ${formatPrice(asset.currentPrice)}
                  </td>
                  <td className="text-right py-2">
                    <ChangeIndicator value={changePct} size="sm" />
                  </td>
                  <td className="text-right py-2">
                    <button
                      onClick={() => handleQuickBuy(asset)}
                      className="text-xs px-2 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 rounded border border-emerald-700 transition-colors"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
        <span className="text-xs text-gray-600 font-mono">
          {sorted.length === 0 ? "0 results" : `${startRow}–${endRow} of ${sorted.length}`}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={safePage === 1}
            className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
          >
            ‹
          </button>

          {/* Page number pills */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
            .reduce<(number | "…")[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="text-xs text-gray-600 px-1">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`text-xs w-7 h-6 rounded border transition-colors font-mono ${
                    safePage === p
                      ? "bg-gray-700 border-gray-500 text-white"
                      : "border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
          >
            ›
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={safePage === totalPages}
            className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
