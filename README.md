# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


# CODE SNIPPET to get Site Logo in Astro 

add_action( 'graphql_register_types', function() {
    register_graphql_field( 'RootQuery', 'siteLogo', [
        'type' => 'String',
        'description' => __( 'The URL of the site logo', 'your-textdomain' ),
        'resolve' => function() {
            $logo_id = get_theme_mod( 'custom_logo' );
            $logo_url = wp_get_attachment_image_url( $logo_id, 'full' );
            return $logo_url ? $logo_url : null;
        }
    ]);
});

# GRAPHQL QUERY TO CHECK IF FORM IS WORKING OR NOT:

mutation MyCustomSubmit {
  submitContactForm(input: {
    name: "Test User",
    email: "test@example.com",
    phone: "123456789",
    subject: "Custom Mutation Test",
    message: "This should work now!"
  }) {
    success
    message
  }
}

-> RUN this query on WP GraphQL IDE to check weather your CONTACT FORM 7 is working or not.


# CODE SNIPPET FOR Wordpress to make contact form work

add_action( 'graphql_register_types', function() {
    register_graphql_mutation( 'submitContactForm', [
        'inputFields' => [
            'name'    => [ 'type' => 'String' ],
            'email'   => [ 'type' => 'String' ],
            'phone'   => [ 'type' => 'String' ], 
            'subject' => [ 'type' => 'String' ], 
            'message' => [ 'type' => 'String' ],
        ],
        'outputFields' => [
            'success' => [ 'type' => 'Boolean' ],
            'message' => [ 'type' => 'String' ],
        ],
        'mutateAndGetPayload' => function( $input ) {
            $form_id = 41;
            $contact_form = WPCF7_ContactForm::get_instance( $form_id );

            // Ensure the $_POST data is set BEFORE anything else
            $_POST = [
                'your-name'    => $input['name'],
                'your-email'   => $input['email'],
                'your-phone'   => $input['phone'],   
                'your-subject' => $input['subject'], 
                'your-message' => $input['message'],
                '_wpcf7'               => $form_id,
                '_wpcf7_version'       => WPCF7_VERSION,
                '_wpcf7_locale'        => 'en_US',
                '_wpcf7_unit_tag'      => 'graphql',
            ];

            // CRITICAL CHANGE: Run the submit logic first
            $result = $contact_form->submit(); 

            // Check if the result status indicates a successful send
            return [
                'success' => ( $result['status'] === 'mail_sent' || $result['status'] === 'mail_skipped' ),
                'message' => $result['message'],
            ];
        }
    ]);
});
