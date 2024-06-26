export class Bonus {
	node;
	level = 0;
	income = 0;
	const = 0;

	constructor(name, income, cost) {
		let item = localStorage.getItem(`bonus_${name}`);
		item = item ? JSON.parse(item) : {};

		this.name = name;
		this.level = parseInt(item.level) || 0;
		this.cost = parseInt(item.cost) || cost;
		this.income = parseInt(item.income) || income;
		this._addItem(name);
	}

	_addItem(name) {
		this.node = document.createElement('button');
		this.node.title = name;
		this.node.classList.add('bonus', 'text-sm', 'box', 'border', 'py-5', 'flex', 'items-center', 'justify-center', 'rounded');
		this.node.disabled = true;
		this.node.innerText = "₽ " + new Intl.NumberFormat("ru-RU").format(this.income);
		this.node.dataset.cost = new Intl.NumberFormat("ru-RU").format(this.cost);
		this.node.dataset.level = this.level;
		
		this.node.addEventListener('click', () => {
			this._upgrade();
		});

		document.getElementById('bonus').appendChild(this.node);
	}

	_upgrade() {
		if (window.score.value < this.cost) return;

		window.score.change(this.cost * -1);

		this.level += 1;
		this.node.dataset.level = this.level < 50 ? this.level : 'max';

		this.cost = Math.round(this.cost * 1.5);
		this.node.dataset.cost = new Intl.NumberFormat("ru-RU").format(this.cost);
		
		if (this.level > 1) {
			this.income = Math.ceil(this.income * 1.2);
			this.node.innerText = "₽ " + new Intl.NumberFormat("ru-RU").format(this.income);
		}

		if (this.level%5 === 0) {
			new Noty({
				type: 'info',
				layout: 'topRight',
				text: `Bonus ${this.name} upgraded to level ${this.level}`,
				timeout: 3000,
			}).show(); 
		}

		this.checkActiveAll();
		this.setIncomeValues();
		this.setMultiplierValues();

		localStorage.setItem(
			`bonus_${this.name}`, 
			JSON.stringify({
				level: this.level,
				cost: this.cost,
				income: this.income,
			})
		);
	}

	checkActive() {
		this.node.disabled = this.level < 50 && window.score.value < this.cost;
	}

	getIncome() {
		if (this.level) {
			return this.income;
		}

		return 0;
	}

	checkActiveAll() {
		for (let i in window.obBonus) {
			window.obBonus[i].checkActive();
		}
	}

	setIncomeValues() {
		let income = 0;
		for (let i in window.obBonus) {
			if (window.obBonus[i].level) {
				income += window.obBonus[i].income;
			}
		}

		window.score.income.set(income);
	}

	setMultiplierValues() {
		let multiplier = 1;
		for (let i in window.obBonus) {
			if (window.obBonus[i].level) {
				multiplier += Math.floor(window.obBonus[i].level / 5) + 1;
			}
		}

		window.score.multiplier.set(multiplier);
	}
}