import Link from 'components/Link';
import './styles.module.scss';

const NUMBER_OF_FLASHY_TITLES = 6;

const FlashyTitle = () => (
	<div id="flashy-title-container">
		<style jsx global>{`
			#flashy-title {
				background-image: url(/images/flashy-titles/${1 + Math.floor(Math.random() * NUMBER_OF_FLASHY_TITLES)}.png);
			}
		`}</style>
		<Link id="flashy-title" href="/" title="MSPFA Home" tabIndex={-1} draggable={false} />
	</div>
);

export default FlashyTitle;