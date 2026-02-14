import type { Champion } from "../types/data";

export function renderChampions(champions: Champion[]): string {
	function map(c: Champion) {
		// Format base stats for display with Icons
		const baseStats = Object.entries(c.stats.base)
			.map(([key, value]) => {
				const icons: Record<string, string> = {
					strength: '<i class="lucide lucide-biceps-flexed"></i>',
					sword: '<i class="lucide lucide-Sword"></i>',
					durability: '<i class="bi bi-shield"></i>',
					agility: '<i class="bi bi-wind"></i>',
					chakra: '<i class="bi bi-fire"></i>',
					yen: '<i class="lucide lucide-badge-japanese-yen"></i>',
					chikara: '<i class="lucide lucide-gem"></i>',
					heart: '<i class="lucide lucide-heart"></i>',
				};
				// Get display name for the stat
				const statDisplayName =
					{
						strength: "STR",
						sword: "SWORD",
						durability: "DURA",
						agility: "AGI&SPD",
						chakra: "CHAKRA",
						yen: "YEN",
						chikara: "CHIKARA",
						heart: "HEART",
					}[key] || key.toUpperCase();

				return `
			<div class="stat-item d-flex flex-column align-items-center">
				<span class="stat-name">${statDisplayName}</span>
				<span class="stat-icon mb-1">${icons[key] || key}</span>
				<span class="stat-value font-medium">${Math.round(value * 100)}%</span>
			</div>
		`;
			})
			.join("");

		// Helper function to format percentage with rounding
		const formatPercent = (value: number): string => {
			return Math.round(value * 100).toString();
		};

		// Helper function to format multiplier (puts x before the number)
		const formatMultiplier = (value: number): string => {
			return `x${(1 + value).toFixed(2)}`;
		};

		// Format modifiers for display as bullet points
		const modifierParts: string[] = [];

		Object.entries(c.stats.modifiers).forEach(([key, value]) => {
			const parts: string[] = [];

			if (key === "health_threshold") {
				const v = value as any;
				if (v.outgoing_damage_increase) parts.push(`+${formatPercent(v.outgoing_damage_increase)}% DMG`);
				if (v.incoming_damage_decrease) parts.push(`DEBUFF: -${formatPercent(v.incoming_damage_decrease)}% DMG`);
				if (v.immunity_duration) parts.push(`${v.immunity_duration}s IMMUNE`);
				if (parts.length) modifierParts.push(`• BELOW ${formatPercent(v.health_value)}% HP: ${parts.join(" • ")}`);
			} else if (key === "kill_effect") {
				const v = value as any;
				modifierParts.push(`• ON KILL: x${v.outgoing_damage_multiplier} DMG • ${v.duration}s`);
			} else if (key === "day_time") {
				const v = value as any;
				if (v.outgoing_damage_multiplier) parts.push(`x${v.outgoing_damage_multiplier} DMG`);
				if (v.incoming_damage_decrease) parts.push(`DEBUFF: -${formatPercent(v.incoming_damage_decrease)}% DMG`);
				if (parts.length) modifierParts.push(`• DAY: ${parts.join(" • ")}`);
			} else if (key === "all_damage") {
				const v = value as any;
				if (v.outgoing_damage_increase) parts.push(`+${formatPercent(v.outgoing_damage_increase)}% DMG`);
				if (v.outgoing_damage_multiplier) parts.push(`x${v.outgoing_damage_multiplier} DMG`);
				if (v.incoming_damage_decrease) parts.push(`DEBUFF: -${formatPercent(v.incoming_damage_decrease)}% DMG`);
				if (parts.length) modifierParts.push(`• ALL DMG: ${parts.join(" • ")}`);
			} else if (key === "outgoing_damage") {
				const v = value as any;
				if (v.outgoing_damage_multiplier) modifierParts.push(`• OUTGOING DMG: x${v.outgoing_damage_multiplier}`);
				if (v.outgoing_damage_increase) modifierParts.push(`• OUTGOING DMG: +${formatPercent(v.outgoing_damage_increase)}%`);
			} else if (key === "incoming_damage") {
				const v = value as any;
				if (v.incoming_damage_decrease) modifierParts.push(`• DEBUFF: -${formatPercent(v.incoming_damage_decrease)}% DMG`);
			} else if (key === "chikara_income") {
				const v = value as any;
				if (v.increased_income_value) {
					modifierParts.push(`• CHIKARA/MIN: ${formatMultiplier(v.increased_income_value)}`);
				}
			} else if (key === "yen_income") {
				const v = value as any;
				if (v.increased_income_value) {
					modifierParts.push(`• YEN/MIN: ${formatMultiplier(v.increased_income_value)}`);
				}
			} else if (key === "heart_income") {
				const v = value as any;
				if (v.increased_income_value) {
					modifierParts.push(`• HEARTS/MIN: ${formatMultiplier(v.increased_income_value)}`);
				}
			} else if (key === "kurama") {
				const v = value as any;
				if (v.outgoing_damage_multiplier) parts.push(`x${v.outgoing_damage_multiplier} DMG`);
				if (v.outgoing_damage_increase) parts.push(`+${formatPercent(v.outgoing_damage_increase)}% DMG`);
				if (v.drop_chance_multiplier) parts.push(`x${v.drop_chance_multiplier} DROP`);
				if (v.drop_chance_increase) parts.push(`+${formatPercent(v.drop_chance_increase)}% DROP`);
				if (parts.length) modifierParts.push(`• KURAMA: ${parts.join(" • ")}`);
			} else if (typeof value === "object" && value !== null) {
				const v = value as any;

				// Format the modifier name nicely - UPPERCASE for consistency
				const modifierName = key
					.split("_")
					.map((word) => word.toUpperCase())
					.join(" ");

				if (v.outgoing_damage_multiplier) parts.push(`x${v.outgoing_damage_multiplier} DMG`);
				if (v.outgoing_damage_increase) parts.push(`+${formatPercent(v.outgoing_damage_increase)}% DMG`);
				if (v.incoming_damage_decrease) parts.push(`DEBUFF: -${formatPercent(v.incoming_damage_decrease)}% DMG`);
				if (v.heal_amount) parts.push(`HEAL ${formatPercent(v.heal_amount)}%`);
				if (v.immunity_duration) parts.push(`${v.immunity_duration}s IMMUNE`);
				if (v.drop_chance_multiplier) parts.push(`x${v.drop_chance_multiplier} DROP`);
				if (v.drop_chance_increase) parts.push(`+${formatPercent(v.drop_chance_increase)}% DROP`);

				if (parts.length) modifierParts.push(`• ${modifierName}: ${parts.join(" • ")}`);
			}
		});

		// Sort modifier parts alphabetically for consistency across cards
		modifierParts.sort();
		const modifierText = modifierParts.join("\n");

		return /*html*/ `
            <div class="card-wrapper col-sm-6 col-md-4">
                <div class="champion-card h-100" 
                     data-champname="${c.name}" 
                     data-board="${c.board}" 
                     data-champchance="${c.chance}" 
                     data-sellcost="${c.cost}"
                     data-stats="${Object.keys(c.stats.base).join(" ")}">
                    
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-bold text-lg text-glow-${c.board === 1 ? "blue" : c.board === 2 ? "purple" : "pink"}">${c.name}</h3>
                        <span class="cyber-badge text-nowrap h-fit ${c.board === 1 ? "badge-blue" : c.board === 2 ? "badge-purple" : "badge-pink"}" data-board-toggle="${c.board}">
                            ${c.board === 3 ? "LIMITED" : "BOARD " + c.board}
                        </span>
                    </div>

                    ${
																					baseStats
																						? /*html*/ `
                        <div class="mb-3">
                            <div class="text-xs terminal-text mb-2">BASE STATS</div>
                            <div class="d-flex gap-3 justify-content-start">
                                ${baseStats}
                            </div>
                        </div>
                    `
																						: ""
																				}
                    
                    <div class="mb-3">
                        <div class="text-sm terminal-text">CHANCES TO OBTAIN</div>
                        <div class="font-medium text-glow-green">${c.chance}</div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="text-sm terminal-text">SELLING COST</div>
                        <div class="font-medium text-glow-blue">${c.cost}</div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="text-sm terminal-text">DESCRIPTION</div>
                        <p class="text-sm">${c.desc}</p>
                    </div>

                    ${
																					modifierText
																						? /*html*/ `
                        <div class="mt-3 pt-2 border-top" style="border-color: rgba(0, 243, 255, 0.2);">
                            <div class="text-sm terminal-text mb-1">MODIFIERS</div>
                            <div class="text-sm" style="white-space: pre-line;">${modifierText}</div>
                        </div>
                    `
																						: ""
																				}
                </div>
            </div>
        `;
	}

	return champions.map(map).join("");
}
