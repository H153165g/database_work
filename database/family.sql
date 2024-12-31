drop TABLE 子勉強記録;

CREATE TABLE 親ログイン情報 (
    UserId Text Primary Key,
    親Id Text not null,
    親パスワード Text not null
);

CREATE TABLE 子ログイン情報(
    UserId Text,
    子Id Text not null,
    学年 Text not null,
    子パスワード Text not null,
    勉強中 Text not null,
    PRIMARY KEY (UserId, 学年)
);

CREATE TABLE 子勉強時間情報(
    UserId Text,
    子Id Text not null,
    時給 Integer not null,
    お小遣い Integer not null,
    外国語 Integer not null,
    数学 Integer not null,
    国語 Integer not null,
    理科 Integer not null,
    社会 Integer not null,
    PRIMARY KEY (UserId, 子Id)
);

CREATE TABLE 子勉強記録(
    UserId Text,
    子Id Text,
    学年 Text,
    教科 Text,
    内容 Text not null,
    時間 Text not null,
    投稿時間 timestamptz not null,
    承認 text not null,
    PRIMARY KEY (UserId, 子Id, 学年, 教科,投稿時間)

);
