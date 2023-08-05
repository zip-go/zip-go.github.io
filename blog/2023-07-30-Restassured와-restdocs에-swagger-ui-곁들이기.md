---
slug: 2
title: restassured 와 restdocs에 swagger ui 곁들이기
authors: 로지
tags: [RestAssured, RestDocs, SwaggerUI, API문서]
---

안녕하세요, 집사의고민 백엔드 개발자 로지입니다. 이번 글에서는 저희 팀이 선택한 API 문서화 방법을 소개하고 어떻게 적용했는지 알려드리려고해요.

---

웹 애플리케이션 API를 구현하고 관리하게 되면 문서화에 어떤 기술을 활용할지 고민하게되는데요,
스프링 진영에는 다음 기술들을 주로 고려하는 것 같습니다.

- Spring Restdocs
- Swagger Generator

결론적으로, 이 둘 중 하나를 써도 되지만 저희 팀은 두 기술을 모두 활용해보기로 했습니다.

저희 팀은 먼저, 실제로 호출되는 API와 문서가 동기화되는 restdocs를 사용하기로 결정했습니다. 하지만 기존에 restdocs를 사용해본 경험이 있는 크루들은 restdocs의 asscidoc 이 swagger ui에 비해 화면/기능에 있어 실용성이 부족하다고 생각했습니다.

이 부분을 절충하기 위해, swagger generator에서 ui를 생성하는 기능만을 사용해 restdocs와 함께 사용해보는 것으로 결정하게 되었습니다.

## 필요한 도구들

- restassured (인수테스트 도구): 저희 팀은 인수테스트를 수행해 restdocs를 발행합니다. 인수테스트에 restassured라는 http 클라이언트 테스트 도구를 사용합니다.
- restdocs (문서화도구): restassured 테스트를 진행하며 API의 정보를 adoc으로 발행합니다.
- **[restdocs-api-spec](https://github.com/ePages-de/restdocs-api-spec):** restdocs에서 만들어준 adoc으로는 바로 swagger UI를 만들 수 없습니다. swagger ui를 발행할 수 있도록, adoc을 open api spec으로 변환해주는 도구입니다.
- **[gradle-swagger-generator-plugin](https://github.com/int128/gradle-swagger-generator-plugin) :** adoc에서 변환된 **open api spec으로부터 swagger ui를** 만드는데 사용할 도구입니다.

눈치채셨겠지만, 테스트부터 ui를 만드는 데까지 사용하는 순서대로 도구를 소개해드렸어요.

## 팀 개발 환경

저희 팀은 다음 환경에서 작업을 진행했습니다!

- java 17
- Spring boot 3
- gradle 8.2.1
- intellij idea

## 흐름 보기

자세한 설정까지는 아니더라도, 코드로 흐름을 본다면 이 글을 읽기가 더 수월할 것 같아 먼저 코드 조각들을 보여드리려고 합니다.

### RestAssured로 테스트하는 코드

```java
@Test
void 파라미터에_이름을_넣고_요청한다() {
    // given
    var 요청_준비 = given(spec)
            .contentType(JSON)
            .filter(성공_응답_문서_만들기("hello-rosie-world-성공"));

    // when
    var 응답 = 요청_준비.when()
            .pathParam("name", "김크루")
            .get("/rosie/{name}");

    // then
    응답.then()
            .assertThat().statusCode(OK.value());
}
```

RestAssured 의 given, when, then 메서드를 사용해서 테스트를 진행합니다.
`요청_준비` 변수를 만드는 마지막줄에 `filter` 메서드에 RestDocs가 문서를 만들수 있도록 다음과 같이 명시해줍니다.

```java
private RestDocumentationFilter 성공_응답_문서_만들기(String 제목) {
    return document(제목,
            API_정보.responseSchema(성공_응답_형식),
            pathParameters(parameterWithName("name").description("놀러와주신 분의 성함")),
            responseFields(
                    fieldWithPath("messages").description("환영의 단어들"),
                    fieldWithPath("ps").description("로지가 추가로 전하는 말").optional()
            ));
	}
```

이 테스트를 실행하면, restdocs가 adoc을 만들어줍니다.

![](https://velog.velcdn.com/images/kyy00n/post/92dcaebd-5baf-4c59-aa2c-d499e04f1a80/image.png)

### open api 스펙으로 변환하기

만들어진 adoc 파일은 다음과 같은데요, swagger UI에 활용할수 있도록 openapi 형식으로 변환해줍니다.
openapi3 태스크를 실행하면 open api 3.0 스펙으로 생성돼요.

![](https://velog.velcdn.com/images/kyy00n/post/a76b6ca3-d2bb-4517-8fef-d20d16123868/image.png)

![](https://velog.velcdn.com/images/kyy00n/post/fa27f6f6-0934-4094-a5cf-0b3a35f90554/image.png)

이렇게 만든 문서는 다음 화면에 대응될 예정입니다 :D

![](https://velog.velcdn.com/images/kyy00n/post/3fcb339f-7d3d-4fb9-aabb-83989d63d7b1/image.png)

## build.gradle 설정

제가 사용한 그래들 스크립트입니다.

### 플러그인

```groovy
plugins {
	// 2. restdocs-api-spec 플러그인 추가
	id 'com.epages.restdocs-api-spec' version "${restdocsApiSpecVersion}"

	// 3. swagger-generator 플러그인 추가
	id 'org.hidetake.swagger.generator' version '2.18.2'
}
```

### dependencies

```groovy
dependencies {
	testImplementation 'io.rest-assured:rest-assured'
	testImplementation 'org.springframework.restdocs:spring-restdocs-restassured'
	testImplementation "com.epages:restdocs-api-spec-restassured:${restdocsApiSpecVersion}"
	testImplementation "com.epages:restdocs-api-spec-mockmvc:${restdocsApiSpecVersion}"

	swaggerUI 'org.webjars:swagger-ui:4.11.1'
}
```

### 플러그인/태스크 설정

- openapi3 설정
- 스웨거 ui 생성
- bootJar 설정

### openapi3

우선 restdocs-api-spec 의 설정을 해줄거예요.

```groovy
openapi3 { // 4. open api 설정
	setServer("http://localhost:8080") // 4-1. 요청 보낼 서버의 baseUrl
	title = "로지 API Docs" // 4-2. 제목
	description = "로지네 API 명세서" // 4-3. 설명
	version = "0.0.1" // 4-4. api 문서의 버전
	format = "yaml" // 4-5. openapi 형식을 저장할 형식 (yaml/json)
}
```

코드와 대응하는 화면을 보여드릴게요.

![](https://velog.velcdn.com/images/kyy00n/post/6d7d35f8-1cc8-42fe-86c7-85615142d71b/image.png)

### GenerateSwaggerUI 설정

그리고 나서, swaggerUI 를 만드는 태스크를 정의해줍니다.
자세한 설명은 주석을 참고해주세요.

```groovy
tasks.withType(GenerateSwaggerUI) { // 5. swaggerUI 를 생성하는 task들은 전부
	dependsOn 'openapi3' // openapi3 이 실행된 이후에 실행되도록 설정
}

swaggerSources { // 6. swagger ui 생성에 필요한 source 설정.
	rosieProject { // ⭐️ rosieProject(이름은 프로젝트에 맞도록 변경) 라는 스웨거 ui의
		setInputFile(file("build/api-spec/openapi3.yaml")) // 소스 위치를 설정. (현재는 default 위치)
	}
}

// 7. rosieProject 에 대한 swagger ui를 생성하는 task.
generateSwaggerUIRosieProject {
	doLast { // ui 파일들이 생성되고 난 뒤
		copy { // 정적 리소스 디렉토리로 복사
			from outputDir.toPath()
			into "build/resources/main/static/docs" // jar 파일에 포한되려면 build/ 내의 위치로 설정해야합니다!
		}
	}
}
```

[2023.08.05 수정]

이전에 제가 실수로 src 하위에 (src/main/resources/static/docs) 파일을 복사하도록 했는데, 이렇게하면 jar 패키징에 생성한 ui파일들이 포함되지 않습니다~

### bootJar 태스크 설정

마지막으로, jar 패키징에 swagger ui가 포함될 수 있도록 설정해줍니다.

```jsx
bootJar {
	dependsOn generateSwaggerUI
}
```

만약 위 스크립트로 안되면

```java
bootJar {
	dependsOn tasks.withType(GenerateSwaggerUI) 
}
```

이렇게 해보시면 됩니다.

## 테스트 코드 작성

### `RequestSpecification` 설정

RestAssured에서 Restdocs를 사용하기 위해서, 저는 다음과 같이 추상클래스에서 RequestSpecification 필드를 관리하게 되었습니다.

```java
@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class AcceptanceTest {

    protected RequestSpecification spec;

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @BeforeEach
    void setUpRestDocs(RestDocumentationContextProvider provider) {
        RestAssuredOperationPreprocessorsConfigurer filter = documentationConfiguration(provider)
                .operationPreprocessors();

        this.spec = new RequestSpecBuilder()
                .setPort(port)
                .addFilter(filter)
                .build();
    }

}
```

### restdocs가 설정된 RequestSpecification 사용하기

restAssured 사용시, specification을 명시하지 않는 `given()` 을 이용하면 다음과 같이 매번 새로운 Specification을 사용합니다.

![](https://velog.velcdn.com/images/kyy00n/post/e081e288-ee0b-4b9b-ad07-2a3ca6babf95/image.png)

![](https://velog.velcdn.com/images/kyy00n/post/81e43472-71c8-44e7-8428-12210ef7e33a/image.png)

우리가 위에서 설정해준 spec 변수를 이용하기 위해서는 다음 방법으로 restAsscured를 사용해야합니다.

```java
(1) given(spec)
(2) given().spec(spec)
(3) given을 사용하지 않는경우: when().spec(spec)
```

### 테스트 별로 생성할 문서 정의하기

보통 restdocs를 asciidoc 으로 문서를 생성할 때는, 다음과 같이`RestAssuredRestDocumentation.document` 를 사용하는데요,

이 메서드를 restdocs-api-spec이 제공하는 wrapper 클래스의 메서드로 바꿔 사용합니다. (구현을 보면 많이 다를 건 없지만, 깃허브를 보면 openapi spec으로 변환할 때 편리함을 위해 제공한다고 합니다.)

```java
private ResourceSnippetDetails API_정보 = resourceDetails()
            .summary("로지월드 들어가기 API")
            .description("로지 월드에 와서 환영을 받습니다.");

@Test
void 파라미터에_이름을_넣고_요청한다() {
    // given
    var 요청_준비 = given(spec)
            .contentType(JSON)
            .filter( // 여기입니다.
								RestAssuredRestDocumentationWrapper.document("hello-rosie-world-성공", API_정보)
						);

    // when
    var 응답 = 요청_준비.when()
            .pathParam("name", "김크루")
            .get("/rosie/{name}");

    // then
    응답.then()
            .assertThat().statusCode(OK.value());
}
```

### 같은 API에 대한 여러 요청(응답)

같은 API에 대해서도, 여러 응답을 문서화해야하는데요. 이 작업은 별도의 작업이 필요하진 않습니다. 테스트별 document 메서드의 **ResourceSnippetDetails 인자를 동일하게** 설정해주면, 하나의 요청으로 간주하여 다음과같이 응답을 합쳐줍니다.

![](https://velog.velcdn.com/images/kyy00n/post/0d87b552-21f4-4e69-89ca-0ebad67d59eb/image.png)

## document() 사용법

![](https://velog.velcdn.com/images/kyy00n/post/cbc9078d-3f2a-461f-9433-39fed34fb201/image.png)

restdocs-api-spec 모듈은 코틀린으로 작성되어서.. 참고하시며 작업하시길 바라구요.
어쨌든, document() 메서드에는 많은 인자들이 들어갈 수 있는데요. 각 인자가 어떤 요소에 대응되는지 정리해봤습니다.

### `identifier`: rest docs 생성 파일 디렉토리명

document() 메서드의 첫번째 인자인데요, 이 아이는 restdocs에서 코드를 생성할 때 만들어지는 디렉토리의 이름이됩니다.

```java
given(spec)
    .contentType(JSON)
    .filter(document("hello-rosie-world-성공", API_정보));
```

이렇게 설정하고, 테스트를 통과한다면 설정한 이름의 디렉토리에 adoc 파일들이 생성된 것을 확인할 수 있어요.

![](https://velog.velcdn.com/images/kyy00n/post/92dcaebd-5baf-4c59-aa2c-d499e04f1a80/image.png)

### `resourceDetails` : API 정보

API 정보는 `ResourceSnippetDetails` 클래스 로 정의합니다.

```java
ResourceSnippetDefails API_정보 = resourceDetails()
    .summary("로지월드 들어가기 API")
    .description("로지 월드에 와서 환영을 받습니다.")

given(spec)
    .contentType(JSON)
    .filter(document("hello-rosie-world-성공", API_정보));
```

이 코드는 다음 화면에 대응돼요.

![](https://velog.velcdn.com/images/kyy00n/post/8be45ced-397d-4c9f-8ca4-8c3510c0154a/image.png)

### `requestProcessor` , `responseProcessor`: 요청/응답에 적용할 프로세서

`OperationProcessor` 객체를 인자로 받습니다. OperationProcessor는 요청 또는 응답이 문서화되기 전에 적용하고 싶은 것을 정의할 수 있어요.

+) 프로세서는 다음과 같은 것들이 있어요: prettyPrint(), removeHeaders() 등..

### `snippeetFilters`

`Function<List<Snippet>, List<Snippet>>` 인데요, 변수명과 자료형을 보아 스니펫 리스트를 필터링하는데 사용하는 것 같습니다.

그러나 정확히 어떤 목적을 위한 변수인지는 모르겠습니다! 아시는 분은 알려주세요~
저는 쓸 필요를 못느껴서 Pass~

### `snippets` : 요청/응답 예시 등 API 문서 조각에 쓰이는 모든 것

`org.springframework.restdocs.snippet` 에 정의돼있는 `Snippet` 객체를 가변 인자로 받아요.

저는 보통 다음과같이 요청 파라미터, 요청/응답 바디 Snippet을 활용하는 편입니다.

```java
document("hello-rosie-world-성공",
  API_정보.responseSchema(성공_응답_형식),
  // 파라미터에 대한 snippet 생성
  pathParameters(parameterWithName("name").description("놀러와주신 분의 성함")),
  // 응답 바디에 대한 snippet 생성
  responseFields(
          fieldWithPath("messages").description("환영의 단어들"),
          fieldWithPath("ps").description("로지가 추가로 전하는 말").optional()
));
```

이외에도 Snippet은 여러가지 종류가 있는데요, 스니펫을 만들기 위해서는 **지정된 정적 팩토리 메서드**를 사용해야해서, 문서화가 필요한 대상의 키워드(ex. 쿼리파라미터, 헤더)로 [restdocs 공식문서](https://docs.spring.io/spring-restdocs/docs/2.0.5.RELEASE/reference/html5/#documenting-your-api)에서 검색해보시면 쉽게 찾을 수 있습니다 :D

## 전체 코드

전체 코드는 깃허브에 올려뒀습니다. 글에서 조각으로 보면 복잡한 것 같기도한데, 한번에 보면 괜찮은 것 같아요.

https://github.com/kyY00n/restassured-restdocs-swaggerui

---

꽤 긴 튜토리얼이었는데요, 처음부터 꼼꼼히 읽기 보다는 초반에 소개드렸던 적용 흐름을 파악하시고, 디테일한 부분들은 공식문서와 함께 보는 것을 추천합니다 :D

여튼 읽어 주셔서 감사합니다.
올바르지 않거나 부족한 설명이 있다면 알려주세요!
여러분의 피드백을 격하게 환영합니다 :D


References
- https://github.com/ePages-de/restdocs-api-spec
- https://github.com/int128/gradle-swagger-generator-plugin
- https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started
