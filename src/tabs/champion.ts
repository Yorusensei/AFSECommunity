import $ from "jquery";
import { Champion } from "../types/data";
import { generateUniqueId } from "../utils/idGenerator";
import { renderChampions } from "../utils/renderChampion";

// Function to manually create sword icons (replaces Lucide)
function createSwordIcons() {
	const swordIcons = document.querySelectorAll(".lucide-Sword");

	swordIcons.forEach((icon) => {
		try {
			// Check if icon has a parent node
			if (!icon.parentNode) {
				return;
			}

			// Create SVG element
			const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("width", "24");
			svg.setAttribute("height", "24");
			svg.setAttribute("viewBox", "0 0 24 24");
			svg.setAttribute("fill", "none");
			svg.setAttribute("stroke", "currentColor");
			svg.setAttribute("stroke-width", "2");
			svg.setAttribute("stroke-linecap", "round");
			svg.setAttribute("stroke-linejoin", "round");
			svg.classList.add("lucide", "lucide-Sword");

			// Sword path data (from Lucide)
			const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", "M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2");
			svg.appendChild(path);

			// Replace the i tag with the SVG
			icon.parentNode.replaceChild(svg, icon);
		} catch (e) {
			// Silently fail
		}
	});

	// Handle biceps-flexed icons
	const bicepsIcons = document.querySelectorAll(".lucide-biceps-flexed");
	bicepsIcons.forEach((icon) => {
		try {
			if (!icon.parentNode) return;

			const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("width", "24");
			svg.setAttribute("height", "24");
			svg.setAttribute("viewBox", "0 0 24 24");
			svg.setAttribute("fill", "none");
			svg.setAttribute("stroke", "currentColor");
			svg.setAttribute("stroke-width", "2");
			svg.setAttribute("stroke-linecap", "round");
			svg.setAttribute("stroke-linejoin", "round");
			svg.classList.add("lucide", "lucide-biceps-flexed");

			// First path
			const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path1.setAttribute(
				"d",
				"M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1",
			);
			svg.appendChild(path1);

			// Second path
			const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path2.setAttribute("d", "M15 14a5 5 0 0 0-7.584 2");
			svg.appendChild(path2);

			// Third path
			const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path3.setAttribute("d", "M9.964 6.825C8.019 7.977 9.5 13 8 15");
			svg.appendChild(path3);

			icon.parentNode.replaceChild(svg, icon);
		} catch (e) {}
	});
}

// Function to reset all cards to be visible
function resetAllCards(container: JQuery<HTMLElement>, allItems: HTMLElement[]) {
	container.empty();
	allItems.forEach((item) => container.append(item));
	$(container).find(".champion-card").closest(".card-wrapper").show();
}

export default {
	render(data: Champion[], id: string, label: string) {
		const FiltersId = {
			1: generateUniqueId(),
			2: generateUniqueId(),
			3: generateUniqueId(),
			Clear: generateUniqueId(),
		} as const;

		// Store original items for reset
		let originalItems: HTMLElement[] = [];

		// Updated sortType to include stat options
		const sortType = [
			"Name (ASC)",
			"Name (DESC)",
			"Chance (ASC)",
			"Chance (DESC)",
			"Selling Cost (ASC)",
			"Selling Cost (DESC)",
			"Strength (ASC)",
			"Strength (DESC)",
			"Durability (ASC)",
			"Durability (DESC)",
			"Agility (ASC)",
			"Agility (DESC)",
			"Sword (ASC)",
			"Sword (DESC)",
			"Chakra (ASC)",
			"Chakra (DESC)",
		] as const;

		const sortId = generateUniqueId();
		const searchId = generateUniqueId();

		$(`#${id}`).html(/*html*/ `
            <h2 class="text-2xl font-bold mb-6 text-glow-purple">${label}</h2>
            
            <div class="row g-3 mb-4">
                <div class="col-12">
                    <input type="text" id="${searchId}" class="cyber-input w-100" placeholder="SEARCH CHAMPIONS...">
                </div>
                
                <div class="col-12 col-lg-auto">
                    <div data-champsearch-filters="true" class="d-flex flex-wrap gap-2">
                        <button id="${FiltersId["1"]}" class="cyber-badge badge-blue">BOARD 1</button>
                        <button id="${FiltersId["2"]}" class="cyber-badge badge-purple">BOARD 2</button>
                        <button id="${FiltersId["3"]}" class="cyber-badge badge-pink">LIMITED</button>
                        <button id="${FiltersId.Clear}" class="cyber-badge active" style="background: rgba(255, 255, 255, 0.1); border-color: var(--gray); color: var(--gray);">
                            SHOW ALL
                        </button>
                    </div>
                </div>
                
                <div class="col-12 col-lg-auto ms-lg-auto">
                    <select name="Sort Champions" id="${sortId}" class="cyber-select p-2 w-100 text-uppercase">
                        ${sortType.map((s) => /*html*/ `<option value="${s}">${s}</option>`)}
                    </select>
                </div>
            </div>

            <div data-champions-content="true" class="row g-2">
                ${renderChampions(data.sort((a, b) => a.name.localeCompare(b.name)))}
            </div>
        `);

		// Create sword icons manually after they're in the DOM and store original items
		setTimeout(() => {
			createSwordIcons();
			// Store original items
			const container = $(`[data-champions-content]`);
			originalItems = container.children(".card-wrapper").toArray();
		}, 100);

		// Handle board toggle buttons from external elements
		$("[data-board-toggle]").on("click touchstart", function (e) {
			e.preventDefault();
			const board = $(this).attr("data-board-toggle");
			if (board && FiltersId[board as keyof typeof FiltersId]) {
				$(`#${FiltersId[board as keyof typeof FiltersId]}`).trigger("click");
			}
		});

		// Filter buttons handler
		$("[data-champsearch-filters] button").on("click touchstart", function (e) {
			e.preventDefault();
			$(this).siblings().removeClass("active");
			$(this).addClass("active");

			const buttonId = $(this).attr("id");

			// Get the container and all original items
			const container = $(`[data-champions-content]`);
			const allItems = originalItems.length ? originalItems : container.children(".card-wrapper").toArray();

			if (buttonId === FiltersId.Clear) {
				// Reset to show all cards
				resetAllCards(container, allItems);
				// Reset sort select to default
				$(`#${sortId}`).val("Name (ASC)");
			} else {
				const filter = Object.keys(FiltersId).find((k) => FiltersId[k as keyof typeof FiltersId] === buttonId);

				if (filter) {
					// First reset all cards
					resetAllCards(container, allItems);

					// Then apply the board filter
					$(`#${id} .champion-card[data-board="${filter}"]`).closest(".card-wrapper").show();
					$(`#${id} .champion-card:not([data-board="${filter}"])`).closest(".card-wrapper").hide();
				}
			}

			// Recreate sword icons after filtering
			setTimeout(createSwordIcons, 50);
		});

		// Sort handler
		$(`#${sortId}`).on("change", function () {
			const type = $(this).val() as string;

			const container = $(`[data-champions-content]`);
			const allItems = originalItems.length ? originalItems : container.children(".card-wrapper").toArray();

			// First, check if this is a stat sort
			const statMatch = type.match(/(Strength|Durability|Agility|Sword|Chakra) \((ASC|DESC)\)/i);

			if (statMatch) {
				const statName = statMatch[1].toLowerCase();

				// Separate items into those with the stat and those without
				const itemsWithStat: HTMLElement[] = [];
				const itemsWithoutStat: HTMLElement[] = [];

				allItems.forEach((item) => {
					const card = $(item).find(".champion-card");

					// Check if this card has the selected stat
					let hasStat = false;
					const statItems = card.find(".stat-item");

					statItems.each((_, statItem) => {
						const $statItem = $(statItem);
						const icon = $statItem.find(".stat-icon").html() || "";

						// Updated to use lucide-biceps-flexed for strength
						if (statName === "strength" && icon.includes("lucide-biceps-flexed")) {
							hasStat = true;
						} else if (statName === "sword" && icon.includes("lucide-Sword")) {
							hasStat = true;
						} else if (statName === "durability" && icon.includes("bi-shield")) {
							hasStat = true;
						} else if (statName === "agility" && icon.includes("bi-wind")) {
							hasStat = true;
						} else if (statName === "chakra" && icon.includes("bi-fire")) {
							hasStat = true;
						}
					});

					if (hasStat) {
						itemsWithStat.push(item);
					} else {
						itemsWithoutStat.push(item);
					}
				});

				// Sort only the items that have the stat
				itemsWithStat.sort((a, b) => {
					const cardA = $(a).find(".champion-card");
					const cardB = $(b).find(".champion-card");
					const direction = statMatch[2];

					// Get stat value
					const getStatValue = (card: JQuery<HTMLElement>): number => {
						const statItems = card.find(".stat-item");
						let statValue = 0;

						statItems.each((_, item) => {
							const $item = $(item);
							const icon = $item.find(".stat-icon").html() || "";

							// Updated to use lucide-biceps-flexed for strength
							if (statName === "strength" && icon.includes("lucide-biceps-flexed")) {
								const valueText = $item.find(".stat-value").text();
								statValue = parseFloat(valueText) || 0;
							} else if (statName === "sword" && icon.includes("lucide-Sword")) {
								const valueText = $item.find(".stat-value").text();
								statValue = parseFloat(valueText) || 0;
							} else if (statName === "durability" && icon.includes("bi-shield")) {
								const valueText = $item.find(".stat-value").text();
								statValue = parseFloat(valueText) || 0;
							} else if (statName === "agility" && icon.includes("bi-wind")) {
								const valueText = $item.find(".stat-value").text();
								statValue = parseFloat(valueText) || 0;
							} else if (statName === "chakra" && icon.includes("bi-fire")) {
								const valueText = $item.find(".stat-value").text();
								statValue = parseFloat(valueText) || 0;
							}
						});

						return statValue;
					};

					const valueA = getStatValue(cardA);
					const valueB = getStatValue(cardB);

					return direction === "ASC" ? valueA - valueB : valueB - valueA;
				});

				// Clear container
				container.empty();

				// Add sorted items with the stat
				itemsWithStat.forEach((item) => container.append(item));
			} else {
				// For non-stat sorts (Name, Chance, Selling Cost), show all items
				allItems.sort((a, b) => {
					const cardA = $(a).find(".champion-card");
					const cardB = $(b).find(".champion-card");

					// Name sorting
					if (type.includes("Name")) {
						const nameA = cardA.attr("data-champname") || "";
						const nameB = cardB.attr("data-champname") || "";
						return type.includes("ASC") ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
					}

					// Chance sorting
					if (type.includes("Chance")) {
						const chanceA = parseFloat(cardA.attr("data-champchance")?.replace("%", "") || "0");
						const chanceB = parseFloat(cardB.attr("data-champchance")?.replace("%", "") || "0");
						return type.includes("ASC") ? chanceA - chanceB : chanceB - chanceA;
					}

					// Selling Cost sorting
					if (type.includes("Selling Cost")) {
						const costA = parseFloat(cardA.attr("data-sellcost") || "0");
						const costB = parseFloat(cardB.attr("data-sellcost") || "0");
						return type.includes("ASC") ? costA - costB : costB - costA;
					}

					return 0;
				});

				// Clear container and show all sorted items
				container.empty();
				allItems.forEach((item) => container.append(item));
			}

			// Recreate sword icons after sorting
			setTimeout(createSwordIcons, 50);
		});

		// Search handler
		$(`#${searchId}`).on("keyup", function () {
			const query = ($(this).val() as string).toUpperCase().trim();

			if (!query) {
				// If search is empty, show all currently filtered items
				const activeFilter = $("[data-champsearch-filters] button.active").attr("id");
				if (activeFilter === FiltersId.Clear) {
					$(`#${id} .champion-card`).closest(".card-wrapper").show();
				} else {
					const filter = Object.keys(FiltersId).find((k) => FiltersId[k as keyof typeof FiltersId] === activeFilter);
					if (filter) {
						$(`#${id} .champion-card[data-board="${filter}"]`).closest(".card-wrapper").show();
					}
				}
			} else {
				$(`#${id} .champion-card`).each((_, card) => {
					const cardName = $(card).attr("data-champname") || "";
					const matches = cardName.toUpperCase().includes(query);

					if (matches) {
						$(card).closest(".card-wrapper").show();
					} else {
						$(card).closest(".card-wrapper").hide();
					}
				});
			}
		});

		// Initial active state for filter buttons
		$(`#${FiltersId.Clear}`).addClass("active");
	},
};
