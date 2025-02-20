/**
 * External dependencies
 */
import { test as base, expect } from '@woocommerce/e2e-playwright-utils';
import { Post } from '@wordpress/e2e-test-utils-playwright/build-types/request-utils/posts';
import path from 'path';

const TEMPLATE_PATH = path.join( __dirname, './active-filters.handlebars' );

const test = base.extend< {
	defaultBlockPostPage: Post;
} >( {
	defaultBlockPostPage: async ( { requestUtils }, use ) => {
		const testingPost = await requestUtils.createPostFromTemplate(
			{ title: 'Active Filters Block' },
			TEMPLATE_PATH,
			{}
		);

		await use( testingPost );
		await requestUtils.deletePost( testingPost.id );
	},
} );

test.describe( 'Filter by Attributes Block - with All products Block', () => {
	test( 'should show correct attrs count (color=blue|query_type_color=or)', async ( {
		page,
		defaultBlockPostPage,
	} ) => {
		await page.goto(
			`${ defaultBlockPostPage.link }?filter_color=blue&query_type_color=or`
		);

		// Check if the page has loaded successfully.
		await expect( page.getByText( 'Active Filters block' ) ).toBeVisible();

		const expectedValues = [ '4', '0', '2', '2', '0' ];

		await expect(
			page
				.locator( 'ul.wc-block-attribute-filter-list' )
				.first()
				.locator(
					'> li:not([class^="is-loading"]) .wc-filter-element-label-list-count > span:not([class^="screen-reader"])'
				)
		).toHaveText( expectedValues );
	} );

	test( 'should show correct attrs count (color=blue,gray|query_type_color=or)', async ( {
		page,
		defaultBlockPostPage,
	} ) => {
		await page.goto(
			`${ defaultBlockPostPage.link }?filter_color=blue,gray&query_type_color=or`
		);

		// Check if the page has loaded successfully.
		await expect( page.getByText( 'Active Filters block' ) ).toBeVisible();

		const expectedValues = [ '4', '3', '2', '2', '0' ];

		await expect(
			page
				.locator( 'ul.wc-block-attribute-filter-list' )
				.first()
				.locator(
					'> li:not([class^="is-loading"]) .wc-filter-element-label-list-count > span:not([class^="screen-reader"])'
				)
		).toHaveText( expectedValues );
	} );

	test( 'should show correct attrs count (color=blue|query_type_color=or|min_price=15|max_price=40)', async ( {
		page,
		defaultBlockPostPage,
	} ) => {
		await page.goto(
			`${ defaultBlockPostPage.link }?filter_color=blue&query_type_color=or&min_price=15&max_price=40`
		);

		// Check if the page has loaded successfully.
		await expect( page.getByText( 'Active Filters block' ) ).toBeVisible();

		const expectedValues = [ '2', '0', '1', '1', '0' ];

		await expect(
			page
				.locator( 'ul.wc-block-attribute-filter-list' )
				.first()
				.locator(
					'> li:not([class^="is-loading"]) .wc-filter-element-label-list-count > span:not([class^="screen-reader"])'
				)
		).toHaveText( expectedValues );
	} );
} );
