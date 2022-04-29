import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('directus_flows', (table) => {
		table.uuid('id').primary().notNullable();
		table.string('name').notNullable();
		table.string('icon', 30);
		table.string('color').nullable();
		table.text('note');
		table.string('status').notNullable().defaultTo('active');
		table.string('trigger');
		table.json('options');
		table.timestamp('date_created').defaultTo(knex.fn.now());
		table.uuid('user_created').references('id').inTable('directus_users').onDelete('SET NULL');
	});

	await knex.schema.createTable('directus_operations', (table) => {
		table.uuid('id').primary().notNullable();
		table.string('name');
		table.string('key').notNullable();
		table.string('type').notNullable();
		table.integer('position_x').notNullable();
		table.integer('position_y').notNullable();
		table.json('options');
		table.timestamp('date_created').defaultTo(knex.fn.now());
		table.uuid('user_created').references('id').inTable('directus_users').onDelete('SET NULL');
	});

	await knex.schema.alterTable('directus_flows', (table) => {
		table.uuid('operation').unique().references('id').inTable('directus_operations').onDelete('SET NULL');
	});

	await knex.schema.alterTable('directus_operations', (table) => {
		table.uuid('resolve').unique().references('id').inTable('directus_operations').onDelete('SET NULL');
		table.uuid('reject').unique().references('id').inTable('directus_operations').onDelete('SET NULL');
		table.uuid('flow').notNullable().references('id').inTable('directus_flows').onDelete('CASCADE');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('directus_operations');
	await knex.schema.dropTable('directus_flows');
}
