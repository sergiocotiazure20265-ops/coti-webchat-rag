# AppWebchat

Interface de atendimento da COTI com Angular standalone. O histórico visual fica em memória até a página ser recarregada; a memória persistida pertence à `api-rag`.

Execute a `api-rag` em `http://localhost:8081` e use `npm start` ou `ng s -o` para iniciar o frontend com o proxy de desenvolvimento configurado no `angular.json`. Abra `http://localhost:4200/`. O serviço chama `/api/rag`; com esse proxy, não é necessário habilitar CORS no backend para o desenvolvimento local. Após alterar a configuração do proxy, reinicie o servidor Angular.

Informe seu nome e envie a pergunta pelo botão ou por Enter. O nome permanece fixo após o primeiro envio. As respostas incluem detalhes expansíveis de assunto, curso, tokens e custo estimado.

Validação: `npm run build` e `npm test -- --watch=false`.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.1.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
