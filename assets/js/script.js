var count = 0;  // 回目

/**
 * チェックボックスの選択肢からアイテムコストを算出
 */
function itemCost(){
    var itemValues = 0;
    $('input[type="checkbox"][name="item"]:checked').map(function() {
        itemValues += parseInt($(this).val());
    }).get();
    return itemValues;
}

// モーダルを開くボタン
var openModalBtn = document.getElementById('openModalBtn');

// モーダル
var modal = document.getElementById('modal');

// 閉じるボタン
var closeBtn = document.getElementsByClassName('close')[0];

// モーダルを開く
openModalBtn.onclick = function() {
    document.getElementById('raw_coin').value = "";
    document.getElementById('get_coin').value = "";
    modal.style.display = 'block';
}

// モーダルを閉じる
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// モーダルの外側をクリックして閉じる
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 入力欄のカンマ編集と数値のみの入力制限
var modalInputs = document.getElementsByClassName('modal-input');
for (var i = 0; i < modalInputs.length; i++) {
    modalInputs[i].addEventListener('input', function() {
        var value = this.value.replace(/,/g, ''); // カンマを削除
        value = value.replace(/[^\d]/g, ''); // 数字以外を削除
        this.value = numberWithCommas(value); // カンマを追加して表示
    });
}

// カンマ編集
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 登録ボタン
var registerBtn = document.getElementById('registerBtn');
registerBtn.onclick = function() {
    // 獲得コインの入力値を取得
    var get_coin = document.getElementById('get_coin').value.trim();

    // 獲得コインの入力が空白であるかチェック
    if (get_coin === '') {
        // エラー文言を表示
        alert('獲得コインの入力が必要です。');
        return; // 処理を中断してモーダルを閉じない
    }

    // モーダルを閉じる
    modal.style.display = 'none';

    // 入力された素コインと獲得コインを取得
    var raw_coin = document.getElementById('raw_coin').value.replace(/,/g, '');

    // テーブル追加
    addTableRow(get_coin, raw_coin);
    totalCoins();
}

/**
 *
 * @param {string} get
 * @param {string} raw
 */
function addTableRow(get, raw){

    count = count + 1;
    var tableBody = document.getElementById("result_list");
    var newRow = document.createElement("tr");

    // 回目
    var idx = document.createElement("td");
    idx.innerHTML = sprintf("<input type='text' value='%s' class='int3'>", count);

    // 結果coin
    var result = document.createElement("td");
    result.innerHTML = sprintf("<input type='text' value='%s' class='char7 resultCoin'>", trimComma(get) - itemCost());

    // 獲得coin
    var get_coin = document.createElement("td");
    get_coin.innerHTML = sprintf("<input type='text' value='%s' class='char7 getCoin'>", get);

    // 素coin
    var raw_coin = document.createElement("td");
    raw_coin.innerHTML = sprintf("<input type='text' value='%s' class='char6 rawCoin'>", raw);

    // 倍率
    var magnification = document.createElement("td");
    magnification.innerHTML = sprintf("<input type='text' value='%s' class='float4 magnification'>", (trimComma(get) / trimComma(raw)).toFixed(2));

    // コスト（アイテム）
    var cost = document.createElement("td");
    cost.innerHTML = sprintf("<input type='text' value='%s' class='int4 costItem'>", itemCost());


    newRow.appendChild(idx);            // 回目
    newRow.appendChild(result);         // 結果coin
    newRow.appendChild(get_coin);       // 獲得coin
    newRow.appendChild(raw_coin);       // 素coin
    newRow.appendChild(magnification);  // 倍率
    newRow.appendChild(cost);           // コスト（アイテム）

    tableBody.appendChild(newRow);

    $('input[type="text"]').off('blur').on('blur',function() {
        totalCoins();
    });
}

/**
 * カンマを除外する
 * @param {string} comma
 * @returns
 */
function trimComma(comma){
    return String(comma).replace(/,/g, '');
}

/**
 * 総計算の算出
 */
function totalCoins() {
    reCalculation();
    var coinInputs = document.getElementsByClassName("resultCoin");
    var coinValues = [];
    let total = 0;
    for (var i = 0; i < coinInputs.length; i++) {
        if(coinInputs[i].value.length > 0){
            total += parseInt(trimComma(coinInputs[i].value));
            coinValues.push(trimComma(parseInt(coinInputs[i].value)));
        }
    }
    $('#plus').html(numberWithCommas(total));
    $('#avg').html(numberWithCommas(parseFloat(total / count).toFixed(1)));
}

/**
 * 各実績コインを再計算（修正時の考慮）
 */
function reCalculation(){
    let $coin_list = $('#result_list > tr');

    for(i=0;i < $coin_list.length; i++){
        // 結果
        $($coin_list[i]).find('.resultCoin').get(0).value
        = numberWithCommas(
            trimComma($($coin_list[i]).find('.getCoin').get(0).value)
            - trimComma($($coin_list[i]).find('.costItem').get(0).value)
        );

        // 倍率
        $($coin_list[i]).find('.magnification').get(0).value
        = (
            trimComma($($coin_list[i]).find('.getCoin').get(0).value)
            / trimComma($($coin_list[i]).find('.rawCoin').get(0).value)
        ).toFixed(2);
    }
}
