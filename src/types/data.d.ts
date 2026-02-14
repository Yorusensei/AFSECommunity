export interface Champion {
	name: string;
	chance: string;
	cost: string;
	board: number;
	desc: string;
}

export interface CommandSubGroup {
	label: string;
	commands: string[];
}

export interface Quest {
	quest: number;
	requirement: string;
	reward: string;
}

export interface AutoClickEntry {
	type: string;
	delay: number[];
	autoTrain: boolean;
	cursorPos: string;
	icon: string;
}

export interface GachaEntry {
	heading: string;
	description: string;
	images: {
		caption: string;
		path: string;
	}[];
}

export interface DataConfig {
	version: string;
	changelog: {
		type: "added" | "removed" | "update";
		timestamp: number;
		list: string[];
	}[];
}

export interface TrainingArea {
	name: string;
	attributeName: string;
	icon: string;
	entries: {
		name: string;
		details: string;
		images: { path: string; caption: string }[];
	}[];
}
export interface DevilFruitImage {
	path: string;
	caption: string;
}

export interface DevilFruitEntry {
	name: string;
	details: string;
	images: DevilFruitImage[];
}

export interface DevilFruitLocations {
	name: string;
	attributeName: string;
	icon: string;
	entries: DevilFruitEntry[];
}

export interface Champion {
	name: string;
	chance: string;
	cost: string;
	board: 1 | 2 | 3;
	desc: string;
	stats: {
		base: {
			strength?: number;
			sword?: number;
			durability?: number;
			agility?: number;
			chakra?: number;
		};
		modifiers: {
			punch?: { outgoing_damage_increase: number };
			strength?: { incoming_damage_decrease: number };
			chakra?: { outgoing_damage_multiplier?: number; outgoing_damage_increase?: number; incoming_damage_decrease?: number };
			heal?: { heal_amount: number };
			kagune?: { outgoing_damage_increase: number; incoming_damage_decrease: number };
			fruit?: { outgoing_damage_increase: number; incoming_damage_decrease: number };
			grimoire?: { outgoing_damage_increase: number; incoming_damage_decrease: number };
			sword_slash?: { outgoing_damage_increase: number; incoming_damage_decrease: number };
			quirk?: { outgoing_damage_increase: number; incoming_damage_decrease: number };
			stand?: { outgoing_damage_increase: number; incoming_damage_decrease?: number };
			health_threshold?: {
				health_value: number;
				outgoing_damage_increase: number;
				incoming_damage_decrease: number;
				immunity_duration: number;
			};
			all_damage?: { outgoing_damage_increase: number; incoming_damage_decrease: number };
			kill_effect?: { outgoing_damage_multiplier: number; duration: number };
			yen_income?: { increased_income_value: number };
			chikara_income?: { increased_income_value: number };
			heart_income?: { increased_income_value: number };
			incoming_damage?: { incoming_damage_decrease: number };
			day_time?: { outgoing_damage_multiplier: number; incoming_damage_decrease: number };
			outgoing_damage?: { outgoing_damage_increase: number };
			stun_immunity?: { immunity_duration: number };
			bloodline?: { outgoing_damage_increase: number };
			kurama?: { outgoing_damage_increase: number; drop_chance_increase: number };
		};
	};
}
